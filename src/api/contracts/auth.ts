import type { AuthSession, DemoSummary } from '@/domain';

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

export interface PlayerProfileContract {
  id: string;
  userId?: string;
  nickname: string;
  status?: 'Active' | 'Inactive' | 'Banned';
  elo?: number;
  boundClubIds?: string[];
  clubId?: string[];
}

export interface CreatedPlayerContract {
  id: string;
  userId: string;
  nickname: string;
  elo: number;
}

export type DemoSummaryContract = DemoSummary;
