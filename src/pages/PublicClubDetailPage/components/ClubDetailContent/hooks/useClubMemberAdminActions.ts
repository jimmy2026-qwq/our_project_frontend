import { AssignClubAdminAPI, RemoveClubMemberAPI } from '@/api/club';
import type { PlayerProfile } from '@/pages/shared_objects/player/PlayerProfile';
import { sendAPI } from '@/system/api';

import { upsertClubAdminOverride } from '../../../functions/getClubAdminOverrides';
import type { ClubAdminMemberEntry } from '@/pages/PublicClubDetailPage/objects/contribution/ClubAdminMemberEntry';
import type { ClubDetailActionContext } from '../objects/ClubDetailActionContext';

export function useClubMemberAdminActions({
  confirmDanger,
  data,
  notifyMutationResult,
  onRefreshDetail,
  profile,
  workbench,
}: ClubDetailActionContext) {
  const { canAssignAdmins, canRemoveMembers, refreshClubMembers } = data;

  async function handleAssignAdmin(member: PlayerProfile) {
    if (!profile?.id || !workbench?.operatorId || !canAssignAdmins) {
      return;
    }

    const confirmed = await confirmDanger({
      title: '设为管理员？',
      message: `这会授予 ${member.displayName} 俱乐部管理员权限。`,
      confirmText: '确认设为管理员',
    });

    if (!confirmed) {
      return;
    }

    await sendAPI(
      new AssignClubAdminAPI(profile.id, {
        playerId: member.playerId,
        operatorId: workbench.operatorId,
      }),
    );

    notifyMutationResult(
      {},
      {
        successTitle: '管理员设置成功',
        successMessage: `${member.displayName} 现在可以管理该俱乐部。`,
        fallbackTitle: '管理员设置需要关注',
        fallbackMessage: '后端更新没有成功完成，请稍后刷新确认。',
      },
    );

    upsertClubAdminOverride(profile.id, member.playerId);
    await refreshClubMembers();
  }

  async function handleRemoveMember(member: ClubAdminMemberEntry) {
    if (
      !profile?.id ||
      !workbench?.operatorId ||
      member.isAdmin ||
      !canRemoveMembers
    ) {
      return;
    }

    const confirmed = await confirmDanger({
      title: '移出俱乐部成员？',
      message: `这会将 ${member.displayName} 从俱乐部成员列表中移除。`,
      confirmText: '确认移除',
    });

    if (!confirmed) {
      return;
    }

    await sendAPI(
      new RemoveClubMemberAPI(profile.id, member.playerId, {
        operatorId: workbench.operatorId,
      }),
    );

    notifyMutationResult({}, {
      successTitle: '成员已移除',
      successMessage: `${member.displayName} 已从该俱乐部移除。`,
      fallbackTitle: '移除成员需要关注',
      fallbackMessage: '后端更新没有成功完成，请稍后刷新确认。',
    });

    await refreshClubMembers();
    onRefreshDetail?.();
  }

  return {
    handleAssignAdmin,
    handleRemoveMember,
  };
}
