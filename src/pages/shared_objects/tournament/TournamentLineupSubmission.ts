export interface TournamentLineupSubmission {
  submissionId: string;
  clubId: string;
  submittedBy: string;
  submittedAt: string;
  activePlayerIds: string[];
  reservePlayerIds: string[];
  note?: string | null;
}
