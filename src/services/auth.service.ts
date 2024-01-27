import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import * as jsonwebtoken from 'jsonwebtoken';
import { JwksClient } from 'jwks-rsa';

import { JWT_MAPPER, OIDC_AUTHORITY, PERMISSIONS, ROLES } from '../consts';

type SecretOrKeyProviderCallback = (error: any, secret: false | string) => void;
type SecretOrKeyProvider = (request: any, rawJwtToken: string, done: SecretOrKeyProviderCallback) => void;

interface OpenIDConfiguration {
  issuer: string;
  authorization_endpoint: string;
  token_endpoint: string;
  userinfo_endpoint?: string;
  jwks_uri: string;
  response_types_supported: string[];
  subject_types_supported: string[];
  id_token_signing_alg_values_supported: string[];
  scopes_supported: string[];
  token_endpoint_auth_methods_supported: string[];
}

@Injectable()
export class AuthService {
  private _oidcConfig: OpenIDConfiguration[] = [];
  private readonly jwkClients: Promise<JwksClient[]>;

  constructor(
    @Inject(ROLES) protected readonly roles: (payload: any) => string[] | Promise<string[]>,
    @Inject(OIDC_AUTHORITY) protected readonly oidcAuthority: string[] | Promise<string[]>,
    @Inject(JWT_MAPPER) protected readonly jwtMapper: (payload: any) => any | Promise<any>,
    @Inject(PERMISSIONS) protected readonly permissions: (payload: any) => string[] | Promise<string[]>,
    protected readonly httpService: HttpService,
  ) {
    this.jwkClients = this.getJwkClients();
  }

  async getJwkClients(): Promise<JwksClient[]> {
    const configurations = await this.oidcConfig();
    const jwkClients: JwksClient[] = [];
    // Create jwk clients for each oidc configuration
    for (const configuration of configurations) {
      jwkClients.push(
        new JwksClient({
          cache: true,
          rateLimit: true,
          cacheMaxEntries: 5,
          jwksRequestsPerMinute: 10,
          jwksUri: configuration.jwks_uri,
        }),
      );
    }

    return jwkClients;
  }

  async oidcConfig(): Promise<OpenIDConfiguration[]> {
    // If we already have the JWK data, return
    if (this._oidcConfig && this._oidcConfig.length > 0) return this._oidcConfig;

    try {
      const authorityUrls = await this.oidcAuthority;
      // Collect JWK payload
      for (const authorityUrl of authorityUrls) {
        const source$ = this.httpService.get(`${authorityUrl}/.well-known/openid-configuration`);
        const response = await lastValueFrom(source$);
        this._oidcConfig.push(response.data);
      }

      return this._oidcConfig;
    } catch (err) {
      throw new BadRequestException('There was an error when attempting to fetch openid-configuration', { cause: err });
    }
  }

  async getPublicKey(rawJwtToken: string): Promise<string> {
    const result = jsonwebtoken.decode(rawJwtToken, { complete: true });

    if (result && typeof result !== 'string' && result.header) {
      const { header } = result;
      const kid = header.kid;
      for (const jwkClient of await this.jwkClients) {
        try {
          const key = await jwkClient.getSigningKey(kid);
          if (!key) {
            continue;
          }

          const pubKey = key.getPublicKey();
          if (!pubKey) {
            continue;
          }

          return pubKey;
        } catch (err) {
          // Ignore errors if key don't match with token
        }
      }
    }

    throw new Error('No header could be decoded from the JWT.');
  }

  get keyProvider(): SecretOrKeyProvider {
    return (request, rawJwtToken, done) => {
      this.getPublicKey(rawJwtToken)
        .then((key: string) => {
          done(null, key);
        })
        .catch((error) => {
          done(error, false);
        });
    };
  }

  async validate(payload: any): Promise<any> {
    const user: any = await this.jwtMapper(payload);

    if (this.roles) {
      user.roles = await this.roles(payload);
    }

    if (this.permissions) {
      user.permissions = await this.permissions(payload);
    }

    return user;
  }
}
