/** 前端展示俱乐部相关赛事时用于区分列表来源的内部取值。 */
export const ClubTournamentSources = {
  Recent: 'recent',
  Invited: 'invited',
} as const;

export type ClubTournamentSource =
  (typeof ClubTournamentSources)[keyof typeof ClubTournamentSources];
