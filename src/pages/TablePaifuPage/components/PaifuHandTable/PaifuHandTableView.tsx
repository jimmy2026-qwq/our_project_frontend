import type { Dispatch, SetStateAction } from 'react';

import type { PaifuRound as PaifuRoundSummary } from '@/objects';
import type { TablePaifuDetail } from '../../objects/TablePaifuDetail';
import { replaySeatOrder as seatOrder } from '../../objects/replaySeatInfo';
import { CenterTable } from './components/CenterTable';
import { ExhaustiveDrawStatusMarkers } from './components/PaifuOverlays/ExhaustiveDrawStatusMarkers';
import { OperationFlash } from './components/PaifuOverlays/OperationFlash';
import { PaifuFinalSettlementOverlay } from './components/PaifuOverlays/PaifuFinalSettlementOverlay';
import { WinningCallFlash } from './components/PaifuOverlays/WinningCallFlash';
import { WinningResultOverlay } from './components/PaifuOverlays/WinningResultOverlay';
import { YakumanTileBurstOverlay } from './components/PaifuOverlays/YakumanTileBurstOverlay';
import { PlayerMelds } from './components/PlayerAreas/PlayerMelds';
import { PlayerRiver } from './components/PlayerAreas/PlayerRiver';
import { ReplayControls } from './components/ReplayControls';
import type { usePaifuHandTableReplay } from './hooks/usePaifuHandTableReplay';
import type { HandVisibilityMode } from './objects/HandVisibilityMode';
import { PaifuPlayerHand } from './PaifuPlayerHand';
import { PaifuRoundPickerLayer } from './PaifuRoundPickerLayer';

interface PaifuHandTableViewProps {
  displayPaifu: TablePaifuDetail;
  handVisibilityMode: HandVisibilityMode;
  isFinalSettlementOpen: boolean;
  isRelativeScoreMode: boolean;
  onCyclePerspective: () => void;
  onSelectRound: (index: number) => void;
  onToggleHandVisibility: () => void;
  onToggleRelativeScoreMode: () => void;
  paifu: TablePaifuDetail;
  perspectiveLabel: string;
  replay: ReturnType<typeof usePaifuHandTableReplay>;
  round: PaifuRoundSummary;
  rounds: PaifuRoundSummary[];
  selectedRoundIndex: number;
  selfPlayerId: string;
  setIsFinalSettlementOpen: Dispatch<SetStateAction<boolean>>;
}

/** 牌谱回放页的完整四家桌面视图。 */
export function PaifuHandTableView({
  displayPaifu,
  handVisibilityMode,
  isFinalSettlementOpen,
  isRelativeScoreMode,
  onCyclePerspective,
  onSelectRound,
  onToggleHandVisibility,
  onToggleRelativeScoreMode,
  paifu,
  perspectiveLabel,
  replay,
  round,
  rounds,
  selectedRoundIndex,
  selfPlayerId,
  setIsFinalSettlementOpen,
}: PaifuHandTableViewProps) {
  return (
    <section className="grid gap-0">
      <div className="relative min-h-[calc(100vh-12px)] overflow-hidden rounded-[28px] border border-[rgba(176,223,229,0.14)] bg-[radial-gradient(circle_at_50%_42%,rgba(236,197,122,0.2),transparent_18%),radial-gradient(circle_at_72%_72%,rgba(236,197,122,0.22),transparent_16%),linear-gradient(135deg,rgba(32,72,89,0.94),rgba(17,47,66,0.96)_48%,rgba(24,41,84,0.96))] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.32)]">
        <div
          aria-hidden="true"
          className="absolute inset-[7%] rounded-[26px] border border-[rgba(236,197,122,0.2)] shadow-[inset_0_0_90px_rgba(7,18,28,0.42)]"
        />
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(236,197,122,0.22)] bg-[radial-gradient(circle,rgba(236,197,122,0.24),transparent_62%)] opacity-80"
        />
        <PaifuHandTableTitle paifu={paifu} />
        <CenterTable
          isExhaustiveDrawResult={replay.isExhaustiveDrawResult}
          isRelativeScoreMode={isRelativeScoreMode}
          isRoundPickerOpen={replay.isRoundPickerOpen}
          onToggleRelativeScoreMode={onToggleRelativeScoreMode}
          onToggleRoundPicker={() =>
            replay.setIsRoundPickerOpen((value) => !value)
          }
          paifu={displayPaifu}
          replayStep={replay.replayStep}
          round={round}
          scoreDisplays={replay.scoreDisplays}
          tableSticks={replay.tableSticks}
        />

        {seatOrder.map((seat) => (
          <PlayerRiver
            key={`${seat}-river`}
            rivers={replay.replaySnapshot.rivers}
            seat={seat}
          />
        ))}
        {seatOrder.map((seat) => (
          <PlayerMelds
            key={`${seat}-melds`}
            melds={replay.replaySnapshot.melds}
            seat={seat}
          />
        ))}
        <PaifuTableOverlays displayPaifu={displayPaifu} replay={replay} round={round} />
        <PaifuRoundPickerLayer
          onSelectRound={onSelectRound}
          replay={replay}
          rounds={rounds}
          selectedRoundIndex={selectedRoundIndex}
          setIsFinalSettlementOpen={setIsFinalSettlementOpen}
        />
        <ReplayControls
          handVisibilityLabel={handVisibilityMode === 'self' ? '只亮自家' : '亮四家'}
          maxReplayStep={replay.maxReplayStep}
          onBackward={() => replay.setReplayStep((value) => Math.max(0, value - 1))}
          onCyclePerspective={onCyclePerspective}
          onForward={() =>
            replay.setReplayStep((value) =>
              Math.min(replay.maxReplayStep, value + 1),
            )
          }
          onToggleHandVisibility={onToggleHandVisibility}
          perspectiveLabel={perspectiveLabel}
          replayStep={replay.replayStep}
        />
        {seatOrder.map((seat) => (
          <PaifuPlayerHand
            key={seat}
            displayPaifu={displayPaifu}
            handVisibilityMode={handVisibilityMode}
            replay={replay}
            round={round}
            seat={seat}
            selfPlayerId={selfPlayerId}
          />
        ))}
        {replay.winningAction ? (
          <WinningResultOverlay
            action={replay.winningAction}
            onConfirm={() => {
              replay.clearWinningAction();
              replay.startSettlementAnimation();
            }}
            playerNames={displayPaifu.metadata.playerNames ?? {}}
            replaySnapshot={replay.replaySnapshot}
            replayStep={replay.replayStep}
            round={round}
          />
        ) : null}
        {isFinalSettlementOpen ? (
          <PaifuFinalSettlementOverlay
            onConfirm={() => {
              setIsFinalSettlementOpen(false);
              onSelectRound(0);
            }}
            paifu={paifu}
          />
        ) : null}
      </div>
    </section>
  );
}

/** 牌谱桌面顶部的赛事、牌桌和记录标题。 */
function PaifuHandTableTitle({ paifu }: { paifu: TablePaifuDetail }) {
  return (
    <div className="absolute right-5 top-5 z-[15] grid max-w-[min(28rem,calc(100%-2.5rem))] justify-items-end gap-1 rounded-2xl border border-[rgba(176,223,229,0.18)] bg-[rgba(7,18,28,0.72)] px-4 py-3 text-right shadow-[0_12px_32px_rgba(0,0,0,0.28)] backdrop-blur">
      <strong className="max-w-full truncate text-sm text-[#f2f7fb]">
        {paifu.metadata.tournamentName ?? paifu.metadata.tournamentId}
      </strong>
      <span className="max-w-full truncate text-xs font-semibold text-[#c7d6e2]">
        {paifu.metadata.stageName ?? paifu.metadata.stageId}
      </span>
    </div>
  );
}

/** 根据当前回放状态选择展示和牌、流局或终局覆盖层。 */
function PaifuTableOverlays({
  displayPaifu,
  replay,
  round,
}: {
  displayPaifu: TablePaifuDetail;
  replay: ReturnType<typeof usePaifuHandTableReplay>;
  round: PaifuRoundSummary;
}) {
  return replay.isExhaustiveDrawResult ? (
    <ExhaustiveDrawStatusMarkers paifu={displayPaifu} round={round} />
  ) : (
    <>
      <OperationFlash operation={replay.activeOperation} />
      <WinningCallFlash flash={replay.activeWinningCall} />
      <YakumanTileBurstOverlay burst={replay.activeYakumanTileBurst} />
    </>
  );
}
