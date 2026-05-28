import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useTablePaifuData } from './useTablePaifuData';

export function useTablePaifuPage() {
  const { tableId = '' } = useParams();
  const navigate = useNavigate();
  const data = useTablePaifuData(tableId);
  const rounds = useMemo(() => data.paifu?.rounds ?? [], [data.paifu]);
  const selectedRound =
    rounds[Math.min(data.selectedRoundIndex, Math.max(rounds.length - 1, 0))];

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(tableId ? `/tables/${tableId}` : '/');
    }
  };

  return {
    error: data.error,
    isLoading: data.isLoading,
    onBack: handleBack,
    paifu: data.paifu,
    replay: {
      onSelectRound: data.setSelectedRoundIndex,
      round: selectedRound,
      rounds,
      selectedRoundIndex: data.selectedRoundIndex,
    },
  };
}
