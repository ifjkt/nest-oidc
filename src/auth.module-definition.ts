import { AuthModuleRegistrationOptions } from './auth.options';
import { ConfigurableModuleBuilder } from '@nestjs/common';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<AuthModuleRegistrationOptions>().setClassMethodName('forRoot').build();
