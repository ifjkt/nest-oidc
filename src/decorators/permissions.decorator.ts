import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_TOKEN = 'permissions';

export const Permissions = (...permissions: string[]) => {
  const hasPermissions: boolean = permissions && permissions.length > 0;
  if (hasPermissions) {
    return SetMetadata(PERMISSIONS_TOKEN, permissions);
  } else {
    return SetMetadata(PERMISSIONS_TOKEN, false);
  }
};
