import { GetPlayerAPI } from '@/api/player';
import {
  TournamentRegisterClubAPI,
  TournamentRegisterPlayerAPI,
} from '@/api/tournament';
import { mapPlayerProfile, type PlayerProfile } from '@/pages/objects/player';
import { sendAPI } from '@/system/api';

import type {
  RefreshTournamentProfile,
  UseTournamentDetailActionsParams,
} from './TournamentDetailActions.types';

export function useTournamentInviteActions({
  availableClubs,
  operatorId,
  refreshTournamentProfile,
  setIsSubmittingTournamentAction,
  setLocalProfile,
  setParticipantPlayers,
  setSelectedClubId,
  setSelectedPlayerId,
  setTournamentActionError,
  workbench,
}: Pick<
  UseTournamentDetailActionsParams,
  | 'availableClubs'
  | 'operatorId'
  | 'setIsSubmittingTournamentAction'
  | 'setLocalProfile'
  | 'setParticipantPlayers'
  | 'setSelectedClubId'
  | 'setSelectedPlayerId'
  | 'setTournamentActionError'
  | 'workbench'
> & {
  refreshTournamentProfile: RefreshTournamentProfile;
}) {
  async function handleInviteClub() {
    if (!workbench?.profile.id || !workbench.selectedClubId || !operatorId) {
      return;
    }

    const invitedClubId = workbench.selectedClubId;

    try {
      setIsSubmittingTournamentAction(true);
      setTournamentActionError('');
      await sendAPI(
        new TournamentRegisterClubAPI(
          workbench.profile.id,
          invitedClubId,
          operatorId,
        ),
      );

      let remainingSelectable = availableClubs.filter(
        (club) => club.id !== invitedClubId,
      );

      try {
        const refreshed = await refreshTournamentProfile(workbench.profile.id);
        remainingSelectable = availableClubs.filter(
          (club) => !(refreshed.clubIds ?? []).includes(club.id),
        );
      } catch {
        setLocalProfile((current) =>
          current
            ? {
                ...current,
                clubIds: Array.from(
                  new Set([...(current.clubIds ?? []), invitedClubId]),
                ),
                clubCount:
                  typeof current.clubCount === 'number'
                    ? Math.max(
                        current.clubCount,
                        (current.clubIds?.length ?? 0) + 1,
                      )
                    : current.clubCount,
              }
            : current,
        );
      }

      setSelectedClubId((current) =>
        current === invitedClubId
          ? (remainingSelectable[0]?.id ?? '')
          : current,
      );
    } catch (error) {
      setTournamentActionError(
        error instanceof Error ? error.message : '邀请俱乐部失败，请稍后重试。',
      );
    } finally {
      setIsSubmittingTournamentAction(false);
    }
  }

  async function handleInvitePlayer() {
    if (!workbench?.profile.id || !workbench.selectedPlayerId || !operatorId) {
      return;
    }

    const invitedPlayerId = workbench.selectedPlayerId;

    try {
      setIsSubmittingTournamentAction(true);
      setTournamentActionError('');
      await sendAPI(
        new TournamentRegisterPlayerAPI(
          workbench.profile.id,
          invitedPlayerId,
          operatorId,
        ),
      );

      const invitedPlayer: PlayerProfile =
        workbench.selectablePlayers.find(
          (player) => player.playerId === invitedPlayerId,
        ) ??
        (await sendAPI(new GetPlayerAPI(invitedPlayerId)).then(
          mapPlayerProfile,
        ));

      setParticipantPlayers((current) => {
        if (current.some((player) => player.playerId === invitedPlayerId)) {
          return current;
        }

        return [...current, invitedPlayer].sort((left, right) =>
          left.displayName.localeCompare(right.displayName, 'zh-CN'),
        );
      });
      setSelectedPlayerId((current) => {
        if (current !== invitedPlayerId) {
          return current;
        }

        return (
          workbench.selectablePlayers.find(
            (player) => player.playerId !== invitedPlayerId,
          )?.playerId ?? ''
        );
      });
    } catch (error) {
      setTournamentActionError(
        error instanceof Error
          ? error.message
          : '邀请个人参赛失败，请稍后重试。',
      );
    } finally {
      setIsSubmittingTournamentAction(false);
    }
  }

  return { handleInviteClub, handleInvitePlayer };
}
