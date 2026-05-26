export interface ClubListQuery {
  activeOnly?: boolean;
  joinableOnly?: boolean;
  memberId?: string;
  adminId?: string;
  name?: string;
  limit?: number;
  offset?: number;
}
