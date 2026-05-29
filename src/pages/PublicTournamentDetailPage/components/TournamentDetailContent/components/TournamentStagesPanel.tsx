import { DetailCard, DetailRow, DetailRows, StatusPill } from '@/components/ui';

import { getStageStatusLabel } from '../../../functions/getTournamentDetailLabels';
import { getStatusTone } from '../../../functions/getTournamentDetailStatus';
import type { TournamentPublicProfile } from '../../../objects/PublicTournamentDetailPage.types';

export function TournamentStagesPanel({
  stages,
}: {
  stages: NonNullable<TournamentPublicProfile['stages']>;
}) {
  return (
    <DetailCard title="阶段信息">
      <DetailRows>
        {stages.map((stage) => (
          <DetailRow
            key={stage.stageId}
            title={stage.name}
            detail={
              <>
                <StatusPill tone={getStatusTone(stage.status)}>
                  {getStageStatusLabel(stage.status)}
                </StatusPill>
                {' / '}
                {stage.tableCount} 桌 / {stage.roundCount} 轮
              </>
            }
          />
        ))}
      </DetailRows>
    </DetailCard>
  );
}
