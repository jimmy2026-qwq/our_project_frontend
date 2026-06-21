import { TablePaifuBackButton } from './components/TablePaifuBackButton';
import { TablePaifuEmpty } from './components/TablePaifuEmpty';
import { TablePaifuLoading } from './components/TablePaifuLoading';
import { usePaifuHandTable } from './components/PaifuHandTable/hooks/usePaifuHandTable';
import { PaifuHandTableView } from './components/PaifuHandTable/PaifuHandTableView';
import { useTablePaifuPageModel } from './hooks/useTablePaifuPageModel';

/** 根据路由加载牌谱并渲染回放桌面、加载和错误状态。 */
export function TablePaifuPage() {
  const page = useTablePaifuPageModel();
  const table = usePaifuHandTable({
    onSelectRound: page.replay.onSelectRound,
    paifu: page.paifu,
    round: page.replay.selectedRound,
    rounds: page.replay.rounds,
    selectedRoundIndex: page.replay.selectedRoundIndex,
    viewerPlayerId: page.viewerPlayerId,
  });

  return (
    <section className="mt-[14px] grid gap-0">
      <TablePaifuBackButton onBack={page.onBack} />
      {page.isLoading ? (
        <TablePaifuLoading />
      ) : !page.paifu || !page.replay.selectedRound || !table ? (
        <TablePaifuEmpty error={page.error} />
      ) : (
        <PaifuHandTableView
          {...table}
          onSelectRound={page.replay.onSelectRound}
          paifu={page.paifu}
          round={page.replay.selectedRound}
          rounds={page.replay.rounds}
          selectedRoundIndex={page.replay.selectedRoundIndex}
        />
      )}
    </section>
  );
}
