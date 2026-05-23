import { useParams } from 'react-router-dom';

import {
  PublicDetailPageFrame,
  PublicDetailNotFound,
  PublicHallLoading,
} from '@/pages/PublicShared/components/shared';

import { PublicTournamentDetailSection } from './components/tournament-detail';
import { useTournamentDetail } from './hooks';

export function PublicTournamentDetailPage() {
  const { tournamentId } = useParams();
  const { state, isLoading, refresh } = useTournamentDetail(tournamentId);

  if (isLoading || !state) {
    return (
      <PublicDetailPageFrame>
        <PublicHallLoading
          eyebrow="赛事详情"
          title="正在加载赛事详情..."
          summary="正在同步赛事信息、阶段数据和管理视图。"
          progressLabel="赛事详情加载中"
          progressMessage="正在获取赛事详情、阶段配置和当前桌次信息。"
        />
      </PublicDetailPageFrame>
    );
  }

  if (!state.item) {
    return (
      <PublicDetailPageFrame>
        <PublicDetailNotFound title="未找到赛事" />
      </PublicDetailPageFrame>
    );
  }

  return (
    <PublicDetailPageFrame>
      <PublicTournamentDetailSection
        key={tournamentId ?? 'missing-tournament'}
        state={state}
        onScheduleSuccess={refresh}
      />
    </PublicDetailPageFrame>
  );
}
