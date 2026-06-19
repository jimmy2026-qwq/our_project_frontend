import type { Dispatch, SetStateAction } from 'react';

import type { PaifuRound as PaifuRoundSummary } from '@/objects';
import { RoundPicker } from './components/CenterTable';
import type { usePaifuHandTableReplay } from './hooks/usePaifuHandTableReplay';

export function PaifuRoundPickerLayer({
  onSelectRound,
  replay,
  rounds,
  selectedRoundIndex,
  setIsFinalSettlementOpen,
}: {
  onSelectRound: (index: number) => void;
  replay: ReturnType<typeof usePaifuHandTableReplay>;
  rounds: PaifuRoundSummary[];
  selectedRoundIndex: number;
  setIsFinalSettlementOpen: Dispatch<SetStateAction<boolean>>;
}) {
  if (!replay.isRoundPickerOpen) {
    return null;
  }

  return (
    <RoundPicker
      onOpenSettlement={() => {
        replay.setIsRoundPickerOpen(false);
        setIsFinalSettlementOpen(true);
      }}
      onSelectRound={(index) => {
        onSelectRound(index);
        replay.setIsRoundPickerOpen(false);
      }}
      rounds={rounds}
      selectedRoundIndex={selectedRoundIndex}
    />
  );
}
