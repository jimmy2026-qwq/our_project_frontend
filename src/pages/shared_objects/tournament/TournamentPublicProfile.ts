import type { TournamentPublicIdentity } from './TournamentPublicIdentity';
import type { TournamentPublicNextStage } from './TournamentPublicNextStage';
import type { TournamentPublicParticipantScope } from './TournamentPublicParticipantScope';
import type { TournamentPublicStageProgress } from './TournamentPublicStageProgress';
import type { TournamentPublicTiming } from './TournamentPublicTiming';

export type TournamentPublicProfile = TournamentPublicIdentity &
  TournamentPublicTiming &
  TournamentPublicStageProgress &
  TournamentPublicParticipantScope &
  TournamentPublicNextStage;
