import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import * as jsonwebtoken from 'jsonwebtoken';
import { JwksClient } from 'jwks-rsa';

import { JWT_MAPPER, OIDC_AUTHORITY, PERMISSIONS, ROLES } from '../consts';

type SecretOrKeyProviderCallback = (error, secret: false | string) => void;
type SecretOrKeyProvider = (request, rawJwtToken, done: SecretOrKeyProviderCallback) => void;

export interface JwksKey {
  kid: string;
  kty: string;
  alg: string;
  use: string;
  n: string;
  e: string;
  x5c: string[];
  x5t: string;
}

@Injectable()
export class AuthService {
  private _oidcConfig: any | null = null;
  private readonly jwksClient: Promise<JwksClient>;

  constructor(
    @Inject(ROLES) protected readonly roles: (payload: any) => string[] | Promise<string[]>,
    @Inject(OIDC_AUTHORITY) protected readonly oidcAuthority: string | Promise<string>,
    @Inject(JWT_MAPPER) protected readonly jwtMapper: (payload: any) => any | Promise<any>,
    @Inject(PERMISSIONS) protected readonly permissions: (payload: any) => string[] | Promise<string[]>,
    protected readonly httpService: HttpService,
  ) {
    this.jwksClient = this.getJwksClient();
  }

  async getJwksClient(): Promise<JwksClient> {
    const { jwks_uri } = await this.oidcConfig();
    return new JwksClient({
      jwksUri: jwks_uri,
    });
  }

  async oidcConfig(): Promise<any> {
    if (this._oidcConfig) return this._oidcConfig;

    try {
      const oidcAuthority = await this.oidcAuthority;
      const source$ = this.httpService.get(`${oidcAuthority}/.well-known/openid-configuration`);
      const response = await lastValueFrom(source$);
      this._oidcConfig = response.data;
      return this._oidcConfig;
    } catch (err) {
      throw new BadRequestException('There was an error when attempting to fetch openid-configuration', { cause: err });
    }
  }

  async getPublicKey(rawJwtToken): Promise<string> {
    const result = jsonwebtoken.decode(rawJwtToken, { complete: true });

    if (result && typeof result !== 'string' && result.header) {
      const { header } = result;
      const kid = header.kid;
      const client = await this.jwksClient;
      const key = await client.getSigningKey(kid);
      return key.getPublicKey();
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
