import { APIMessage } from '@/system/api';
import type { AuthSuccessView, BootstrapSuperAdminRequest } from '@/objects/auth';

export class BootstrapSuperAdminAuthAPI extends APIMessage<AuthSuccessView> {
  constructor(
    readonly bootstrapKey: string,
    readonly username: string,
    readonly password: string,
    readonly displayName: string,
  ) {
    super();
  }

  static fromRequest(payload: BootstrapSuperAdminRequest) {
    return new BootstrapSuperAdminAuthAPI(
      payload.bootstrapKey,
      payload.username,
      payload.password,
      payload.displayName,
    );
  }
}
