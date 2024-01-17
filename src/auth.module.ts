import { Module } from '@nestjs/common';
import { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } from './auth.module-definition';
import { HttpModule } from '@nestjs/axios';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './services';
import { JwtStrategy } from './strategies';
import { JWT_MAPPER, OIDC_AUTHORITY, PERMISSIONS, ROLES } from './consts';
import { AuthModuleRegistrationOptions } from './auth.options';

/**/

@Module({
  imports: [HttpModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: OIDC_AUTHORITY,
      inject: [MODULE_OPTIONS_TOKEN],
      useFactory: (options: AuthModuleRegistrationOptions) => options.oidcAuthority,
    },
    {
      provide: ROLES,
      inject: [MODULE_OPTIONS_TOKEN],
      useFactory: (options: AuthModuleRegistrationOptions) => options.roles,
    },
    {
      provide: JWT_MAPPER,
      inject: [MODULE_OPTIONS_TOKEN],
      useFactory: (options: AuthModuleRegistrationOptions) => options.jwtMapper,
    },
    {
      provide: PERMISSIONS,
      inject: [MODULE_OPTIONS_TOKEN],
      useFactory: (options: AuthModuleRegistrationOptions) => options.permissions,
    },
  ],
})
export class AuthModule extends ConfigurableModuleClass {}
