import { useParams } from 'react-router-dom';

import {
  PublicClubDetailSection,
  PublicDetailNotFound,
  PublicHallLoading,
} from '@/features/public-hall/components';
import { useClubDetail } from '@/features/public-hall/hooks';

export function PublicClubDetailPage() {
  const { clubId } = useParams();
  const { state, isLoading, refresh } = useClubDetail(clubId);

  if (isLoading || !state) {
    return (
      <div className="tournament-detail-page">
        <PublicHallLoading
          eyebrow="俱乐部详情"
          title="正在载入俱乐部详情..."
          summary="正在同步俱乐部公开信息、近期赛事和成员管理数据。"
          progressLabel="俱乐部详情加载中"
          progressMessage="加载完成后会直接进入新的详情界面。"
        />
      </div>
    );
  }

  if (!state.item) {
    return (
      <div className="tournament-detail-page">
        <PublicDetailNotFound title="Club not found" />
      </div>
    );
  }

  return (
    <div className="tournament-detail-page">
      <PublicClubDetailSection state={state} onRefreshDetail={refresh} />
    </div>
  );
}
