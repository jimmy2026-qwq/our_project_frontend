import {
  AcceptClubTournamentAPI,
  DeclineClubTournamentAPI,
} from '@/api/club';
import { sendAPI } from '@/system/api';

import type { ClubPublicProfile } from '../../../objects/types';
import type { ClubDetailActionContext } from './ClubDetailActions.types';

export function useClubTournamentInvitationActions({
  confirmDanger,
  notifyMutationResult,
  onRefreshDetail,
  workbench,
}: ClubDetailActionContext) {
  async function handleAcceptTournamentInvitation(
    tournament: ClubPublicProfile['activeTournaments'][number],
  ) {
    if (!workbench?.profile.id || !workbench.operatorId) {
      return;
    }

    await sendAPI(
      new AcceptClubTournamentAPI(
        workbench.profile.id,
        tournament.id,
        workbench.operatorId,
      ),
    );

    notifyMutationResult(
      { source: 'api' as const },
      {
        successTitle: '已通过赛事邀请',
        successMessage: `${workbench.profile.name} 已加入 ${tournament.name}。`,
        fallbackTitle: '赛事邀请处理需要关注',
        fallbackMessage: '后端更新没有成功完成，请稍后刷新确认。',
      },
    );

    onRefreshDetail?.();
  }

  async function handleDeclineTournamentInvitation(
    tournament: ClubPublicProfile['activeTournaments'][number],
  ) {
    if (!workbench?.profile.id || !workbench.operatorId) {
      return;
    }

    const confirmed = await confirmDanger({
      title: '拒绝赛事邀请？',
      message: `这会拒绝 ${tournament.name} 对 ${workbench.profile.name} 的参赛邀请。`,
      confirmText: '确认拒绝',
    });

    if (!confirmed) {
      return;
    }

    await sendAPI(
      new DeclineClubTournamentAPI(
        workbench.profile.id,
        tournament.id,
        workbench.operatorId,
      ),
    );

    notifyMutationResult(
      { source: 'api' as const },
      {
        successTitle: '已拒绝赛事邀请',
        successMessage: `${tournament.name} 的邀请已经处理。`,
        fallbackTitle: '赛事邀请处理需要关注',
        fallbackMessage: '后端更新没有成功完成，请稍后刷新确认。',
      },
    );

    onRefreshDetail?.();
  }

  return {
    handleAcceptTournamentInvitation,
    handleDeclineTournamentInvitation,
  };
}
