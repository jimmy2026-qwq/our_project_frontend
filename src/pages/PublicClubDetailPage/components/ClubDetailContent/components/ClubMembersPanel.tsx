import { EmptyState, StatusPill } from '@/components/ui';
import { cx } from '@/components/ui/cx';
import type { PlayerProfile } from '@/pages/objects/player';

import type { ClubAdminMemberEntry } from '../../../objects/ClubDetail.types';
import { formatNumber } from '../../../functions/formatClubDetail';
import { clubPanelClassNames } from './styles';

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

export function ClubMembersPanel({
  isLoading,
  members,
  canAssignAdmins,
  canAdjustContributions,
  canEditTitles,
  canRemoveMembers,
  onOpenContributionTitles,
  onAssignAdmin,
  onAdjustContribution,
  onEditTitle,
  onRemoveMember,
}: {
  isLoading: boolean;
  members: ClubAdminMemberEntry[];
  canAssignAdmins: boolean;
  canAdjustContributions: boolean;
  canEditTitles: boolean;
  canRemoveMembers: boolean;
  onOpenContributionTitles: () => void;
  onAssignAdmin: (member: PlayerProfile) => void;
  onAdjustContribution: (member: ClubAdminMemberEntry) => void;
  onEditTitle: (member: ClubAdminMemberEntry) => void;
  onRemoveMember: (member: ClubAdminMemberEntry) => void;
}) {
  const canShowActions =
    canAssignAdmins ||
    canAdjustContributions ||
    canRemoveMembers;

  if (isLoading) {
    return (
      <section className="grid gap-3">
        <ContributionTitlesButton onClick={onOpenContributionTitles} />
        <p className="m-0 text-[#9ab0c1]">正在加载成员列表...</p>
      </section>
    );
  }

  return (
    <section
      className={cx(clubPanelClassNames.list, 'grid-rows-[auto_minmax(0,1fr)]')}
    >
      <ContributionTitlesButton onClick={onOpenContributionTitles} />
      <div className={clubPanelClassNames.listBody}>
        {members.length > 0 ? (
          members.map((member) => {
            const badgeText = getMemberBadgeText(member);

            return (
              <article
                key={member.playerId}
                className={clubPanelClassNames.row}
              >
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
                      {canRemoveMembers &&
                      !member.isAdmin &&
                      !member.isCurrentUser ? (
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
          })
        ) : (
          <EmptyState asListItem={false}>当前没有成员数据。</EmptyState>
        )}
      </div>
    </section>
  );
}

function ContributionTitlesButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="flex justify-end">
      <button
        type="button"
        className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[rgba(176,223,229,0.24)] bg-[rgba(5,14,23,0.82)] text-[1rem] font-bold text-[#c7d6e2] transition hover:-translate-y-px hover:border-[rgba(239,189,111,0.44)] hover:text-[#f5c98e]"
        aria-label="查看通用贡献头衔"
        title="查看通用贡献头衔"
        onClick={onClick}
      >
        i
      </button>
    </div>
  );
}
