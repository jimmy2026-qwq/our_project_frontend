export type TournamentHeaderStageAction = {
  kind: 'scheduleStage' | 'completeStage' | 'settleTournament';
  label: string;
  stageId: string;
} | null;
