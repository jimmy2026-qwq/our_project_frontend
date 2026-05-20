export interface PlayerListQuery {
  clubId?: string;
  status?: 'Active' | 'Inactive' | 'Banned';
  nickname?: string;
  limit?: number;
  offset?: number;
}
