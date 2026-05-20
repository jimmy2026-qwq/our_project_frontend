import { APIMessage } from '@/system/api';
import type { AuthSuccessResponse, RegisterAccountRequest } from '@/objects/auth';

export class RegisterAuthAPI extends APIMessage<AuthSuccessResponse> {
  constructor(
    readonly username: string,
    readonly password: string,
    readonly displayName: string,
  ) {
    super();
  }

  static fromRequest(payload: RegisterAccountRequest) {
    return new RegisterAuthAPI(payload.username, payload.password, payload.displayName);
  }
}
