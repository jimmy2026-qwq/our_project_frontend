import { useNavigate, useParams } from 'react-router-dom';

import { useAuth } from '@/app/auth/useAuth';

import { PublicClubDetailSection } from './components/PublicClubDetailSection';
import {
  PublicClubDetailFrame,
  PublicClubDetailLoading,
  PublicClubDetailNotFound,
} from './components/PublicClubDetailFrame';
import { useClubDetail } from './hooks';

export function PublicClubDetailPage() {
  const navigate = useNavigate();
  const { clubId } = useParams();
  const { session } = useAuth();
  const { state, isLoading, refresh } = useClubDetail(clubId, { session });

  if (isLoading || !state) {
    return (
      <PublicClubDetailFrame>
        <PublicClubDetailLoading />
      </PublicClubDetailFrame>
    );
  }

  if (!state.item) {
    return (
      <PublicClubDetailFrame>
        <PublicClubDetailNotFound title="Club not found" />
      </PublicClubDetailFrame>
    );
  }

  return (
    <PublicClubDetailFrame>
      <PublicClubDetailSection
        state={state}
        session={session}
        onNavigateBack={() => navigate('/public')}
        onRefreshDetail={refresh}
      />
    </PublicClubDetailFrame>
  );
}
