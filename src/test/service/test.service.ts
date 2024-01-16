import { Injectable } from '@nestjs/common';

@Injectable()
export class TestService {
  async getPermissions(): Promise<string[]> {
    return ['PERMISSION_SECURE_ACCESS'];
  }
}
