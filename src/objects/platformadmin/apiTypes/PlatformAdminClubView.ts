export interface PlatformAdminClubView {
  clubId: string;
  name: string;
  creator: string;
  createdAt: string;
  memberCount: number;
  adminCount: number;
  totalPoints: number;
  powerRating: number;
  dissolvedAt: string | null;
  dissolvedBy: string | null;
}
