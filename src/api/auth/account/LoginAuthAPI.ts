import { APIMessage } from '@/system/api';
import type { AuthSuccessView, LoginRequest } from '@/objects/auth';

export class LoginAuthAPI extends APIMessage<AuthSuccessView> {
  constructor(
    readonly username: string,
    readonly password: string,
  ) {
    super();
  }

  static fromRequest(payload: LoginRequest) {
    return new LoginAuthAPI(payload.username, payload.password);
  }
}
