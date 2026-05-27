import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { TablePaifuEmpty, TablePaifuLoading, TablePaifuSection } from './components';
import { useTablePaifuData } from './hooks';

export function TablePaifuPage() {
  const { tableId = '' } = useParams();
  const navigate = useNavigate();
  const {
    paifu,
    error,
    isLoading,
    selectedRoundIndex,
    setSelectedRoundIndex,
  } = useTablePaifuData(tableId);
  const rounds = useMemo(() => paifu?.rounds ?? [], [paifu]);
  const selectedRound =
    rounds[Math.min(selectedRoundIndex, Math.max(rounds.length - 1, 0))];

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(tableId ? `/tables/${tableId}` : '/');
    }
  };

  if (isLoading) {
    return <TablePaifuLoading onBack={handleBack} />;
  }

  if (!paifu || !selectedRound) {
    return <TablePaifuEmpty error={error} onBack={handleBack} />;
  }

  return (
    <TablePaifuSection
      onBack={handleBack}
      onSelectRound={setSelectedRoundIndex}
      paifu={paifu}
      round={selectedRound}
      rounds={rounds}
      selectedRoundIndex={selectedRoundIndex}
    />
  );
}
