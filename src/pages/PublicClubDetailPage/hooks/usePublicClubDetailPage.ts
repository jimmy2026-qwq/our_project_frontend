import { useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useAuth } from '@/app/auth/useAuth';
import { useRealtimeRefresh } from '@/app/realtime/useRealtimeRefresh';

import { useClubDetailWorkbench } from '../components/ClubDetailContent/hooks/useClubDetailWorkbench';
import { useClubDetail } from './useClubDetail';

export function usePublicClubDetailPage() {
  const navigate = useNavigate();
  const { clubId } = useParams();
  const { session } = useAuth();
  const { state, isLoading, refresh } = useClubDetail(clubId, { session });
  const handleRealtimeRefresh = useCallback(() => {
    refresh();
  }, [refresh]);
  useRealtimeRefresh(
    ['ClubChanged', 'ClubApplicationChanged', 'ClubMemberChanged'],
    handleRealtimeRefresh,
  );
  const controls = useClubDetailWorkbench({
    state,
    session,
    onRefreshDetail: refresh,
  });
  const workbench = controls.workbench;
  const profile = workbench?.profile ?? null;
  const clubSummary = useMemo(() => {
    if (!profile) {
      return null;
    }

    return {
      id: profile.id,
      name: profile.name,
      memberCount: profile.memberCount,
      powerRating: profile.powerRating,
      treasury: profile.treasury,
      relations: profile.relations,
    };
  }, [
    profile?.id,
    profile?.memberCount,
    profile?.name,
    profile?.powerRating,
    profile?.relations,
    profile?.treasury,
  ]);

  return {
    state,
    isLoading,
    workbench,
    controls,
    clubSummary,
    onNavigateBack: () => navigate('/public'),
    onRefreshDetail: refresh,
  };
}
