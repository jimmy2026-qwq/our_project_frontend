import { StatusPill } from '@/components/ui';
import { cx } from '@/components/ui/cx';
import type { PlayerProfile } from '@/pages/objects/PlayerProfile';

import type { ClubAdminMemberEntry } from '../../../objects/ClubDetail.types';
import { formatNumber } from '../../../functions/formatClubDetail';
import { clubPanelClassNames } from '../styles';

function getMemberBadgeText(member: ClubAdminMemberEntry) {
  const internalTitle = member.internalTitle?.trim();

  if (internalTitle) {
    return internalTitle;
  }

  const rankTitle = (member.rankLabel || member.rankCode)?.trim();

  if (rankTitle && rankTitle !== '成员') {
    return rankTitle;
  }

  if (member.isAdmin) {
    return '管理员';
  }

  return null;
}

function getMemberBadgeClassName(member: ClubAdminMemberEntry) {
  if (!member.internalTitle?.trim()) {
    return undefined;
  }

  return 'border-[rgba(178,132,255,0.34)] bg-[rgba(154,112,255,0.16)] text-[#cdb8ff]';
}

function getMemberBadgeTone(member: ClubAdminMemberEntry) {
  return member.isAdmin ? 'success' : 'warning';
}

export function ClubMemberRow({
  canAdjustContributions,
  canAssignAdmins,
  canEditTitles,
  canRemoveMembers,
  canShowActions,
  member,
  onAdjustContribution,
  onAssignAdmin,
  onEditTitle,
  onRemoveMember,
}: {
  canAdjustContributions: boolean;
  canAssignAdmins: boolean;
  canEditTitles: boolean;
  canRemoveMembers: boolean;
  canShowActions: boolean;
  member: ClubAdminMemberEntry;
  onAdjustContribution: (member: ClubAdminMemberEntry) => void;
  onAssignAdmin: (member: PlayerProfile) => void;
  onEditTitle: (member: ClubAdminMemberEntry) => void;
  onRemoveMember: (member: ClubAdminMemberEntry) => void;
}) {
  const badgeText = getMemberBadgeText(member);

  return (
    <article key={member.playerId} className={clubPanelClassNames.row}>
      <div className={clubPanelClassNames.rowMain}>
        <div className="flex flex-wrap items-center gap-2">
          <strong>{member.displayName}</strong>
          {badgeText && canEditTitles ? (
            <button
              type="button"
              className="m-0 cursor-pointer border-0 bg-transparent p-0"
              onClick={() => onEditTitle(member)}
              title="设置专属头衔"
            >
              <StatusPill
                tone={getMemberBadgeTone(member)}
                className={getMemberBadgeClassName(member)}
              >
                {badgeText}
              </StatusPill>
            </button>
          ) : badgeText ? (
            <StatusPill
              tone={getMemberBadgeTone(member)}
              className={getMemberBadgeClassName(member)}
            >
              {badgeText}
            </StatusPill>
          ) : null}
          {typeof member.elo === 'number' ? (
            <StatusPill tone="warning">ELO {member.elo}</StatusPill>
          ) : null}
        </div>
        {typeof member.contribution === 'number' ? (
          <span>贡献值 {formatNumber(member.contribution)}</span>
        ) : null}
      </div>
      <div
        className={cx(
          clubPanelClassNames.rowSide,
          clubPanelClassNames.rowSideMemberAdmin,
        )}
      >
        {canShowActions ? (
          <div className={clubPanelClassNames.actionRow}>
            {canAssignAdmins && !member.isAdmin ? (
              <button
                type="button"
                className={clubPanelClassNames.action}
                onClick={() => onAssignAdmin(member)}
              >
                设为管理员
              </button>
            ) : null}
            {canAdjustContributions ? (
              <button
                type="button"
                className={cx(
                  clubPanelClassNames.action,
                  clubPanelClassNames.actionGold,
                )}
                onClick={() => onAdjustContribution(member)}
              >
                修改贡献值
              </button>
            ) : null}
            {canRemoveMembers && !member.isAdmin && !member.isCurrentUser ? (
              <button
                type="button"
                className={cx(
                  clubPanelClassNames.action,
                  clubPanelClassNames.actionDanger,
                )}
                onClick={() => onRemoveMember(member)}
              >
                移出成员
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}
