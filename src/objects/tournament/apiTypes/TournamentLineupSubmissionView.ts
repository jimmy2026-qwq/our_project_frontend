export interface TournamentLineupSubmissionView {
  submissionId: string;
  clubId: string;
  submittedBy: string;
  submittedAt: string;
  activePlayerIds: string[];
  reservePlayerIds: string[];
  note: string | null;
}
