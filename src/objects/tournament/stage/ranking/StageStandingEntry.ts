export interface StageStandingEntry {
  playerId: string;
  matchesPlayed: number;
  placementPoints: number;
  totalScoreDelta: number;
  totalFinalPoints: number;
  averagePlacement: number;
  qualified: boolean;
  seed: number | null;
}
