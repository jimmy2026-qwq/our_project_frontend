import type {
  ApiMessagePayloadContract,
  LoginPayload,
  RegisterPayload,
  AuthSessionContract,
  AuthSuccessContract,
} from '@/objects/auth';
import { request, sendJson } from '../shared/http';

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
