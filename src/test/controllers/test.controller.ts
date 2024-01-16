import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../guards';
import { Permissions, Roles } from '../../decorators';

@Controller()
export class TestController {
  @Get('/')
  helloWorld(): string {
    return 'Hello World!';
  }

  @Get('/secure')
  @UseGuards(JwtAuthGuard)
  secureEndpoint(): string {
    return "I'm a secure endpoint!";
  }

  @UseGuards(JwtAuthGuard)
  @Get('/secure/permission')
  @Permissions('PERMISSION_SECURE_ACCESS')
  securedWithPermission() {
    return "I'm a secure endpoint via permissions!";
  }

  @UseGuards(JwtAuthGuard)
  @Roles('ROLE_TESTER')
  @Get('/secure/role')
  securedWithRole() {
    return "I'm a secure endpoint via roles!";
  }
}
