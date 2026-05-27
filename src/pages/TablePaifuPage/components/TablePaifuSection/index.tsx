import type { PaifuRoundSummary, TablePaifuDetail } from '../../types';
import { PaifuHandTable } from '../PaifuHandTable';
import { TablePaifuBackButton } from '../TablePaifuBackButton';

interface TablePaifuSectionProps {
  onBack: () => void;
  onSelectRound: (index: number) => void;
  paifu: TablePaifuDetail;
  round: PaifuRoundSummary;
  rounds: PaifuRoundSummary[];
  selectedRoundIndex: number;
}

export function TablePaifuSection({
  onBack,
  onSelectRound,
  paifu,
  round,
  rounds,
  selectedRoundIndex,
}: TablePaifuSectionProps) {
  return (
    <section className="mt-[14px] grid gap-0">
      <TablePaifuBackButton onBack={onBack} />
      <PaifuHandTable
        onSelectRound={onSelectRound}
        paifu={paifu}
        round={round}
        rounds={rounds}
        selectedRoundIndex={selectedRoundIndex}
      />
    </section>
  );
}
