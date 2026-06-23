import type { Dispatch, SetStateAction } from 'react';

import type { PlayerProfile } from '@/pages/shared_objects/player/PlayerProfile';
import type { TournamentPublicProfile } from '@/pages/shared_objects/tournament/TournamentPublicProfile';
import type { TournamentStageRuleDraft } from '@/pages/PublicTournamentDetailPage/objects/stage/TournamentStageRuleDraft';

export interface TournamentDetailActionSetters {
  setIsSubmittingTournamentAction: Dispatch<SetStateAction<boolean>>;
  setLocalProfile: Dispatch<SetStateAction<TournamentPublicProfile | null>>;
  setParticipantPlayers: Dispatch<SetStateAction<PlayerProfile[]>>;
  setPublishBlockedOpen: Dispatch<SetStateAction<boolean>>;
  setRuleDraft: Dispatch<SetStateAction<TournamentStageRuleDraft>>;
  setRulesDialogOpen: Dispatch<SetStateAction<boolean>>;
  setSelectedClubId: Dispatch<SetStateAction<string | null>>;
  setSelectedPlayerId: Dispatch<SetStateAction<string | null>>;
  setTournamentActionError: Dispatch<SetStateAction<string>>;
}
