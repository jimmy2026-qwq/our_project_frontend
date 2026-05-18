export interface PlatformAdminPlayerContract {
  id: string;
  userId: string;
  nickname: string;
  status: 'Active' | 'Inactive' | 'Banned';
  elo: number;
  bannedReason?: string | null;
  roleGrants?: unknown[];
}
