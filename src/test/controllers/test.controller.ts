import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../guards';
import { IsAuthenticationOptional, Permissions, Roles } from '../../decorators';

@Controller()
@UseGuards(JwtAuthGuard)
export class TestController {
  @Get('/')
  @IsAuthenticationOptional(true)
  helloWorld(): string {
    return 'Hello World!';
  }

  @Get('/secure')
  secureEndpoint(): string {
    return "I'm a secure endpoint!";
  }

  @Get('/secure/permission')
  @Permissions('PERMISSION_A')
  securedWithPermission() {
    return "I'm a secure endpoint via permissions!";
  }

  @Get('/secure/permission-other')
  @Permissions('PERMISSION_D')
  securedWithOtherPermission() {
    return "I'm a secure endpoint via permissions!";
  }

  @Roles('ROLE_TESTER')
  @Get('/secure/role')
  securedWithRole() {
    return "I'm a secure endpoint via roles!";
  }

  @Roles('ROLE_ADMIN')
  @Get('/secure/role-other')
  securedWithOtherRole() {
    return "I'm a secure endpoint via other roles!";
  }

  @Roles('ROLE_TESTER')
  @Permissions('PERMISSION_A')
  @Get('/secure/role-permission')
  securedWithRoleAndPermission() {
    return "I'm a secure endpoint via roles and permissions!";
  }

  @Roles('ROLE_TESTER')
  @Permissions('PERMISSION_OTHER')
  @Get('/secure/role-permission-other')
  securedWithRoleAndOtherPermission() {
    return "I'm a secure endpoint via roles and other permissions!";
  }

  @Roles('ROLE_ADMIN')
  @Permissions('PERMISSION_A')
  @Get('/secure/role-other-permission')
  securedWithRoleOtherAndPermission() {
    return "I'm a secure endpoint via roles and other permissions!";
  }

  @Roles('ROLE_ADMIN')
  @Permissions('PERMISSION_OTHER')
  @Get('/secure/role-other-permission-other')
  securedWithRoleOtherAndPermissionOther() {
    return "I'm a secure endpoint via roles and other permissions!";
  }
}
