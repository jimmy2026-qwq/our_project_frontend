import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useAuth } from '@/app/auth/useAuth';

import { useClubDetailWorkbench } from '../components/ClubDetailContent/hooks/useClubDetailWorkbench';
import { useClubDetail } from './useClubDetail';

export function usePublicClubDetailPage() {
  const navigate = useNavigate();
  const { clubId } = useParams();
  const { session } = useAuth();
  const { state, isLoading, refresh } = useClubDetail(clubId, { session });
  const controls = useClubDetailWorkbench({
    state,
    session,
    onRefreshDetail: refresh,
  });
  const workbench = controls.workbench;
  const clubSummary = useMemo(() => {
    if (!workbench) {
      return null;
    }

    return {
      id: workbench.profile.id,
      name: workbench.profile.name,
      memberCount: workbench.profile.memberCount,
      powerRating: workbench.profile.powerRating,
      treasury: workbench.profile.treasury,
      relations: workbench.profile.relations,
    };
  }, [workbench]);

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
