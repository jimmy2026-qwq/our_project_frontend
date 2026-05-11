import type { LoginPayload, RegisterPayload } from '@/domain';
import type {
  ApiMessagePayloadContract,
  AuthSessionContract,
  AuthSuccessContract,
} from './contracts/auth';
import { request, sendJson } from './http';

export const authAuthnApi = {
  login(payload: LoginPayload) {
    return sendJson<AuthSuccessContract>('/auth/login', 'POST', payload);
  },
  register(payload: RegisterPayload) {
    return sendJson<AuthSuccessContract>('/auth/register', 'POST', payload);
  },
  getAuthSession(token: string) {
    return request<AuthSessionContract>('/auth/session', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  logout(token: string) {
    return sendJson<ApiMessagePayloadContract>(
      '/auth/logout',
      'POST',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  },
};
