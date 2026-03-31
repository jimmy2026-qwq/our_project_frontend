import { useParams } from 'react-router-dom';

import {
  PublicClubDetailSection,
  PublicDetailNotFound,
  PublicHallLoading,
} from '@/features/public-hall/components';
import { useClubDetail } from '@/features/public-hall/hooks';

export function PublicClubDetailPage() {
  const { clubId } = useParams();
  const { state, isLoading } = useClubDetail(clubId);

  if (isLoading || !state) {
    return <PublicHallLoading />;
  }

  if (!state.item) {
    return <PublicDetailNotFound title="Club not found" />;
  }

  return <PublicClubDetailSection state={state} />;
}
