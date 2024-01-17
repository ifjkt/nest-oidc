import { SetMetadata } from '@nestjs/common';

export const ROLES_TOKEN = 'roles';

export const Roles = (...roles: string[]) => {
  const hasRoles: boolean = roles.length > 0;
  if (hasRoles) {
    return SetMetadata(ROLES_TOKEN, roles);
  } else {
    return SetMetadata(ROLES_TOKEN, false);
  }
};
