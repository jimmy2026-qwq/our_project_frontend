import { EmptyState, StatusPill } from '@/components/ui';
import { cx } from '@/components/ui/cx';
import type { ClubContributionAuditEntry } from '@/objects';

import type { ClubAdminMemberEntry } from '../../../objects/club-detail.types';
import {
  formatDateTime,
  formatNumber,
} from '../../../objects/format';
import { clubPanelClassNames } from './styles';

export function ClubContributionChangesPanel({
  isLoading,
  changes,
  members,
}: {
  isLoading: boolean;
  changes: ClubContributionAuditEntry[];
  members: ClubAdminMemberEntry[];
}) {
  const memberNamesById = new Map(
    members.map((member) => [member.playerId, member.displayName]),
  );
  const memberRanksById = new Map(
    members.map((member) => [
      member.playerId,
      member.rankLabel || member.rankCode || '成员',
    ]),
  );

  if (isLoading) {
    return <p className="m-0 text-[#9ab0c1]">正在加载贡献变化列表...</p>;
  }

  return (
    <section className={clubPanelClassNames.list}>
      <div className={clubPanelClassNames.listBody}>
        {changes.length > 0 ? (
          changes.map((change) => {
            const playerId = change.playerId ?? '';
            const delta = change.delta ?? '--';
            const contribution = change.contribution ?? '--';
            const playerName = memberNamesById.get(playerId) ?? (playerId || '--');
            const rankLabel = memberRanksById.get(playerId) ?? '--';
            const deltaValue = Number(delta);
            const contributionValue = Number(contribution);
            const deltaText =
              Number.isFinite(deltaValue) && deltaValue >= 0
                ? `+${delta}`
                : delta;
            const contributionText = Number.isFinite(contributionValue)
              ? formatNumber(contributionValue)
              : contribution;

            return (
              <article key={change.id} className={clubPanelClassNames.row}>
                <div className={clubPanelClassNames.rowMain}>
                  <div className="flex flex-wrap items-center gap-2">
                    <strong>{playerName}</strong>
                    <StatusPill tone={deltaValue >= 0 ? 'success' : 'danger'}>
                      {deltaText}
                    </StatusPill>
                    <StatusPill
                      tone="warning"
                      className="border-[rgba(239,189,111,0.52)] bg-[rgba(239,189,111,0.18)] text-[#ffd98a]"
                    >
                      {rankLabel}
                    </StatusPill>
                  </div>
                  <span>调整后贡献值 {contributionText}</span>
                  {change.note ? <span>理由 {change.note}</span> : null}
                </div>
                <div
                  className={cx(
                    clubPanelClassNames.rowSide,
                    clubPanelClassNames.rowSideMemberAdmin,
                  )}
                >
                  <span>{formatDateTime(change.occurredAt)}</span>
                  <span>操作人 {change.actorId ?? '--'}</span>
                </div>
              </article>
            );
          })
        ) : (
          <EmptyState asListItem={false}>当前没有贡献值变化记录。</EmptyState>
        )}
      </div>
    </section>
  );
}
