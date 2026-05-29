import {
  Button,
  DetailCard,
  DetailList,
  DetailListItem,
  StatusPill,
} from '@/components/ui';

import {
  formatDateTime,
  getTournamentStatusLabel,
} from '../../../functions/getTournamentDetailLabels';
import { getStatusTone } from '../../../functions/getTournamentDetailStatus';
import type { TournamentPublicProfile } from '../../../objects/PublicTournamentDetailPage.types';

export function TournamentOverviewPanel({
  profile,
  showMoreInfo,
  onToggleShowMore,
}: {
  profile: TournamentPublicProfile;
  showMoreInfo: boolean;
  onToggleShowMore: () => void;
}) {
  return (
    <DetailCard
      title={<span className="text-[1.25rem] font-semibold">赛事信息</span>}
    >
      <div className="grid gap-4">
        <DetailList>
          <DetailListItem
            label="状态"
            value={
              <StatusPill tone={getStatusTone(profile.status)}>
                {getTournamentStatusLabel(profile.status)}
              </StatusPill>
            }
          />
          <DetailListItem label="主办方" value={profile.venue} />
          {showMoreInfo ? (
            <>
              <DetailListItem label="阶段数" value={profile.stageCount} />
              <DetailListItem label="参赛类型" value={profile.whitelistType} />
              <DetailListItem
                label="俱乐部数量"
                value={profile.clubCount ?? profile.clubIds?.length ?? 0}
              />
              <DetailListItem
                label="玩家数量"
                value={profile.playerCount ?? 0}
              />
              <DetailListItem
                label="白名单数量"
                value={profile.whitelistCount ?? 0}
              />
              <DetailListItem label="下一阶段" value={profile.nextStageName} />
              <DetailListItem
                label="下一次排程时间"
                value={formatDateTime(profile.nextScheduledAt)}
              />
            </>
          ) : null}
        </DetailList>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={onToggleShowMore}>
            {showMoreInfo ? '收起详情' : '展开详情'}
          </Button>
        </div>
      </div>
    </DetailCard>
  );
}
