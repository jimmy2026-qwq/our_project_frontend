import { APIMessage } from '@/system/api';
import type { AuthSuccessView, BootstrapSuperAdminRequest } from '@/objects/auth';

export class BootstrapSuperAdminAuthAPI extends APIMessage<AuthSuccessView> {
  constructor(readonly request: BootstrapSuperAdminRequest) {
    super();
  }

  static fromRequest(payload: BootstrapSuperAdminRequest) {
    return new BootstrapSuperAdminAuthAPI(payload);
  }
}
