import { EmptyState } from '@/components/ui';
import { cx } from '@/components/ui/cx';
import type { PlayerProfile } from '@/pages/objects/PlayerProfile';

import type { ClubAdminMemberEntry } from '../../../objects/ClubDetail.types';
import { clubPanelClassNames } from '../styles';
import { ClubMemberRow } from './ClubMemberRow';

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
    canAssignAdmins || canAdjustContributions || canRemoveMembers;

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
          members.map((member) => (
            <ClubMemberRow
              key={member.playerId}
              canAdjustContributions={canAdjustContributions}
              canAssignAdmins={canAssignAdmins}
              canEditTitles={canEditTitles}
              canRemoveMembers={canRemoveMembers}
              canShowActions={canShowActions}
              member={member}
              onAdjustContribution={onAdjustContribution}
              onAssignAdmin={onAssignAdmin}
              onEditTitle={onEditTitle}
              onRemoveMember={onRemoveMember}
            />
          ))
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
