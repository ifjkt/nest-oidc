import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_AUTHENTICATION_OPTIONAL_TOKEN, PERMISSIONS_TOKEN, ROLES_TOKEN } from '../decorators';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(protected readonly reflector: Reflector) {
    super();
  }

  getRequest(context: ExecutionContext) {
    return context.switchToHttp().getRequest();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isAuthOptional = this.reflector.get<boolean>(IS_AUTHENTICATION_OPTIONAL_TOKEN, context.getHandler());

    try {
      await super.canActivate(context);
    } catch (err) {
      const isUnauthorized = err instanceof UnauthorizedException;
      if (!isUnauthorized || (isUnauthorized && !isAuthOptional)) {
        throw err;
      }
    }

    const permissions = this.reflector.get<string[]>(PERMISSIONS_TOKEN, context.getHandler());
    if (!permissions) {
      return true;
    }

    const roles = this.reflector.get<string[]>(ROLES_TOKEN, context.getHandler());
    if (!roles && !permissions) {
      return true;
    }

    const request = this.getRequest(context);

    const user = request.user;

    if (!user) {
      return true;
    }

    let hasRoleAuthority = true;
    if (roles && roles.length > 0) {
      hasRoleAuthority = user && user.roles && user.roles.some((role: string) => roles.includes(role));
    }

    let hasPermissionAuthority = true;
    if (permissions && permissions.length > 0) {
      hasPermissionAuthority =
        user && user.permissions && user.permissions.some((permission: string) => permissions.includes(permission));
    }

    return hasRoleAuthority && hasPermissionAuthority;
  }
}
