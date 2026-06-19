import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useAuthContext } from '@/app/auth/useAuthContext';

import { useTablePaifuData } from './useTablePaifuData';

export function useTablePaifuPageModel() {
  const { tableId = '' } = useParams();
  const navigate = useNavigate();
  const { session } = useAuthContext();
  const data = useTablePaifuData(tableId);
  const rounds = useMemo(() => data.paifu?.rounds ?? [], [data.paifu]);
  const selectedRound =
    rounds[Math.min(data.selectedRoundIndex, Math.max(rounds.length - 1, 0))];
  const viewerPlayerId =
    session?.user.operatorId ?? session?.user.userId ?? '';

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate(tableId ? `/tables/${tableId}` : '/');
  };

  return {
    error: data.error,
    isLoading: data.isLoading,
    onBack: handleBack,
    paifu: data.paifu,
    replay: {
      onSelectRound: data.setSelectedRoundIndex,
      rounds,
      selectedRound,
      selectedRoundIndex: data.selectedRoundIndex,
    },
    viewerPlayerId,
  };
}
