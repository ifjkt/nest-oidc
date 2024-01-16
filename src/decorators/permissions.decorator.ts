import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_TOKEN = 'permissions';

export const Permissions = (...permissions: string[]) => {
  // check to see if any roles have been passed
  const hasPermissions: boolean =
    permissions && permissions.length > 0 && !(permissions.length === 1 && permissions[0] === undefined);
  if (hasPermissions) {
    return SetMetadata(PERMISSIONS_TOKEN, permissions);
  } else {
    // if no roles have been set, then disable roles
    return SetMetadata(PERMISSIONS_TOKEN, false);
  }
};
