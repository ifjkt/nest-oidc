import { RoleEvaluator } from './interfaces';
import { Provider, Type } from '@nestjs/common';

export interface AuthModuleRegistrationOptions {
  oidcAuthority: string | Promise<string>;
  roleEvaluators?: RoleEvaluator[] | Promise<RoleEvaluator[]>;
  jwtMapper?: (payload: any) => any | Promise<any>;
  permissions?: (payload: any) => string[] | Promise<string[]>;
}

export interface AuthModuleAsyncRegistrationOptions {
  name?: string;
  useFactory?: (...args: any[]) => Promise<AuthModuleRegistrationOptions> | AuthModuleRegistrationOptions;
  inject?: any[];
  extraProviders?: Provider[];
}
