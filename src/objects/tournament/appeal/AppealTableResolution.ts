export const AppealTableResolutions = {
  RestorePriorState: 'RestorePriorState',
  ArchiveTable: 'ArchiveTable',
  ResumeScoring: 'ResumeScoring',
  ResumePlay: 'ResumePlay',
  ForceReset: 'ForceReset',
} as const;

export type AppealTableResolution =
  (typeof AppealTableResolutions)[keyof typeof AppealTableResolutions];
