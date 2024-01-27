import { Provider } from '@nestjs/common';

export interface AuthModuleRegistrationOptions {
  oidcAuthority: string[] | Promise<string[]>;
  roles?: (payload: any) => string[] | Promise<string[]>;
  jwtMapper?: (payload: any) => any | Promise<any>;
  permissions?: (payload: any) => string[] | Promise<string[]>;
}

export interface AuthModuleAsyncRegistrationOptions {
  name?: string;
  useFactory?: (...args: any[]) => Promise<AuthModuleRegistrationOptions> | AuthModuleRegistrationOptions;
  inject?: any[];
  extraProviders?: Provider[];
}
