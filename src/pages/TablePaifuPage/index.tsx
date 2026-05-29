import { TablePaifuBackButton } from './components/TablePaifuBackButton';
import { TablePaifuEmpty } from './components/TablePaifuEmpty';
import { TablePaifuLoading } from './components/TablePaifuLoading';
import { PaifuHandTable } from './components/PaifuHandTable';
import { useTablePaifuPage } from './hooks/useTablePaifuPage';

export function TablePaifuPage() {
  const page = useTablePaifuPage();

  if (page.isLoading) {
    return <TablePaifuLoading onBack={page.onBack} />;
  }

  if (!page.paifu || !page.replay.round) {
    return <TablePaifuEmpty error={page.error} onBack={page.onBack} />;
  }

  return (
    <section className="mt-[14px] grid gap-0">
      <TablePaifuBackButton onBack={page.onBack} />
      <PaifuHandTable
        onSelectRound={page.replay.onSelectRound}
        paifu={page.paifu}
        round={page.replay.round}
        rounds={page.replay.rounds}
        selectedRoundIndex={page.replay.selectedRoundIndex}
      />
    </section>
  );
}
