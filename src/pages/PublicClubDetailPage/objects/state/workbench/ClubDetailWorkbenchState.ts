import type { ClubDetailApplicationWorkbenchState } from './ClubDetailApplicationWorkbenchState';
import type { ClubDetailBaseWorkbenchState } from './ClubDetailBaseWorkbenchState';
import type { ClubDetailContributionDataWorkbenchState } from './ClubDetailContributionDataWorkbenchState';
import type { ClubDetailContributionDialogWorkbenchState } from './ClubDetailContributionDialogWorkbenchState';
import type { ClubDetailDialogWorkbenchState } from './ClubDetailDialogWorkbenchState';
import type { ClubDetailMemberWorkbenchState } from './ClubDetailMemberWorkbenchState';
import type { ClubDetailPermissionWorkbenchState } from './ClubDetailPermissionWorkbenchState';
import type { ClubDetailTournamentWorkbenchState } from './ClubDetailTournamentWorkbenchState';

export type ClubDetailWorkbenchState = ClubDetailBaseWorkbenchState &
  ClubDetailApplicationWorkbenchState &
  ClubDetailContributionDataWorkbenchState &
  ClubDetailContributionDialogWorkbenchState &
  ClubDetailDialogWorkbenchState &
  ClubDetailMemberWorkbenchState &
  ClubDetailPermissionWorkbenchState &
  ClubDetailTournamentWorkbenchState;
