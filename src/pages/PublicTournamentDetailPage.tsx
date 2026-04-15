import { useParams } from 'react-router-dom';

import {
  PublicDetailNotFound,
  PublicHallLoading,
  PublicTournamentDetailSection,
} from '@/features/public-hall/components';
import { useTournamentDetail } from '@/features/public-hall/hooks';

export function PublicTournamentDetailPage() {
  const { tournamentId } = useParams();
  const { state, isLoading, refresh } = useTournamentDetail(tournamentId);

  if (isLoading || !state) {
    return (
      <div className="tournament-detail-page">
        <PublicHallLoading
          eyebrow="赛事详情"
          title="正在加载赛事详情..."
          summary="正在同步赛事信息、阶段数据和管理视图。"
          progressLabel="赛事详情加载中"
          progressMessage="正在获取赛事详情、阶段配置和当前桌次信息。"
        />
      </div>
    );
  }

  if (!state.item) {
    return (
      <div className="tournament-detail-page">
        <PublicDetailNotFound title="未找到赛事" />
      </div>
    );
  }

  return (
    <div className="tournament-detail-page">
      <PublicTournamentDetailSection state={state} onScheduleSuccess={refresh} />
    </div>
  );
}
