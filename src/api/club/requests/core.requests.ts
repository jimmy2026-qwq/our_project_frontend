export interface ClubFilters {
  activeOnly?: boolean;
  joinableOnly?: boolean;
  memberId?: string;
  adminId?: string;
  limit?: number;
  offset?: number;
}

export interface CreateClubPayload {
  name: string;
  creatorId: string;
}
