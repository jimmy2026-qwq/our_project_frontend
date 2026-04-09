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
      <PublicHallLoading
        eyebrow="俱乐部详情"
        title="正在加载俱乐部详情..."
        summary="正在同步俱乐部资料、成员信息和近期赛事。"
        progressLabel="俱乐部详情加载中"
        progressMessage="正在获取俱乐部公开资料、成员状态和相关赛事信息。"
      />
    );
  }

  if (!state.item) {
    return <PublicDetailNotFound title="Club not found" />;
  }

  return <PublicClubDetailSection state={state} onRefreshDetail={refresh} />;
}
