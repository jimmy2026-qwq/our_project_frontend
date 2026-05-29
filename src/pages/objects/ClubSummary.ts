export interface ClubSummary {
  id: string;
  name: string;
  memberCount: number;
  activeMemberCount?: number;
  adminCount?: number;
  powerRating: number;
  treasury: number;
  totalPoints?: number;
  pointPool?: number;
  allianceCount?: number;
  rivalryCount?: number;
  strongestRivalClubId?: string | null;
  strongestRivalPower?: number | null;
  honorTitles?: string[];
  relations: Array<'Alliance' | 'Hostile'>;
}
