import { useNavigate, useParams } from 'react-router-dom';

import {
  PublicDetailPageFrame,
  PublicDetailNotFound,
  PublicHallLoading,
} from '@/pages/PublicHall/components/shared';
import { useAuth } from '@/app/auth/useAuth';

import { PublicClubDetailSection } from './components/club-detail';
import { useClubDetail } from './hooks';

export function PublicClubDetailPage() {
  const navigate = useNavigate();
  const { clubId } = useParams();
  const { session } = useAuth();
  const { state, isLoading, refresh } = useClubDetail(clubId, { session });

  if (isLoading || !state) {
    return (
      <PublicDetailPageFrame>
        <PublicHallLoading
          eyebrow="俱乐部详情"
          title="正在载入俱乐部详情..."
          summary="正在同步俱乐部公开信息、近期赛事和成员管理数据。"
          progressLabel="俱乐部详情加载中"
          progressMessage="加载完成后会直接进入新的详情界面。"
        />
      </PublicDetailPageFrame>
    );
  }

  if (!state.item) {
    return (
      <PublicDetailPageFrame>
        <PublicDetailNotFound title="Club not found" />
      </PublicDetailPageFrame>
    );
  }

  return (
    <PublicDetailPageFrame>
      <PublicClubDetailSection
        state={state}
        session={session}
        onNavigateBack={() => navigate('/public')}
        onRefreshDetail={refresh}
      />
    </PublicDetailPageFrame>
  );
}
