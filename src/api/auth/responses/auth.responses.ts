import type { AuthSession } from '@/objects';

export interface AuthSuccessContract {
  userId: string;
  username: string;
  displayName: string;
  token: string;
  roles: AuthSession['user']['roles'];
}

export interface AuthSessionContract {
  userId: string;
  username: string;
  displayName: string;
  authenticated: boolean;
  roles: AuthSession['user']['roles'];
}

export interface ApiMessagePayloadContract {
  message: string;
}
