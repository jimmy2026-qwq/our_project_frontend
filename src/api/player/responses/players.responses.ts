export interface PlayerProfileContract {
  id: string;
  userId: string;
  nickname: string;
  status: 'Active' | 'Inactive' | 'Banned';
  elo: number;
  boundClubIds: string[];
}

export interface CreatedPlayerContract {
  id: string;
  userId: string;
  nickname: string;
  elo: number;
}
