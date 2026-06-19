import { PlayerRiver } from '@/pages/TablePaifuPage/components/PaifuHandTable/components/PlayerAreas/PlayerRiver';
import { OperationFlash } from '@/pages/TablePaifuPage/components/PaifuHandTable/components/PaifuOverlays/OperationFlash';
import { WinningCallFlash } from '@/pages/TablePaifuPage/components/PaifuHandTable/components/PaifuOverlays/WinningCallFlash';
import { YakumanTileBurstOverlay } from '@/pages/TablePaifuPage/components/PaifuHandTable/components/PaifuOverlays/YakumanTileBurstOverlay';
import { useMahjongTileImagePreload } from '@/pages/TablePaifuPage/components/PaifuHandTable/hooks/useMahjongTileImagePreload';

import { MatchActionBar } from './components/ActionBar/MatchActionBar';
import { MatchCenterTable } from './components/CenterTable/MatchCenterTable';
import { MatchMeldArea } from './components/MeldArea/MatchMeldArea';
import { MatchPlayerHand } from './components/PlayerHand/MatchPlayerHand';
import { FinalSettlementOverlay } from './components/ResultOverlay/FinalSettlementOverlay';
import { MatchResultOverlay } from './components/ResultOverlay/MatchResultOverlay';
import { seatOrder } from './functions/matchBoardSeats';
import { shouldHideWinningHand } from './functions/getMatchBoardSettlement';
import { useMatchBoardModel } from './hooks/useMatchBoardModel';
import type { MatchBoardProps } from './objects/MatchBoardProps';

export function MatchBoard(props: MatchBoardProps) {
  useMahjongTileImagePreload();

  const model = useMatchBoardModel(props);
  const mahjongTable = model.mahjongTable;
  const table = model.table;

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
        <div className="absolute right-5 top-5 z-[15] grid max-w-[min(28rem,calc(100%-2.5rem))] justify-items-end gap-1 rounded-2xl border border-[rgba(176,223,229,0.18)] bg-[rgba(7,18,28,0.72)] px-4 py-3 text-right shadow-[0_12px_32px_rgba(0,0,0,0.28)] backdrop-blur">
          {model.showcaseMode ? (
            <span className="rounded-full border border-[rgba(242,247,251,0.42)] bg-[rgba(242,247,251,0.12)] px-2 py-0.5 text-[0.68rem] font-bold text-[#f2f7fb]">
              展示模式
            </span>
          ) : null}
          <strong className="max-w-full truncate text-sm text-[#f2f7fb]">
            赛事桌 {String(table.tableNo).padStart(2, '0')}
          </strong>
          <span
            aria-label={`牌桌版本 v${mahjongTable.version}`}
            className="max-w-full truncate text-xs font-semibold text-[#c7d6e2]"
          >
            {table.stageId} / v{mahjongTable.version}
          </span>
        </div>

        <MatchCenterTable
          isRelativeScoreMode={model.isRelativeScoreMode}
          mahjongTable={mahjongTable}
          onToggleRelativeScoreMode={model.toggleRelativeScoreMode}
          scoreDisplays={model.scoreDisplays}
          seatsByDisplaySeat={model.seatMap}
        />

        {seatOrder.map((seat) => (
          <PlayerRiver key={`${seat}-river`} rivers={model.rivers} seat={seat} />
        ))}
        <MatchMeldArea melds={model.melds} />
        <OperationFlash
          operation={
            model.winningCallFlash ||
            model.riichiCallFlash ||
            model.winResultNeedsSequence
              ? undefined
              : model.activeOperation
          }
        />
        <WinningCallFlash
          flash={model.winningCallFlash ?? model.riichiCallFlash}
        />
        <YakumanTileBurstOverlay burst={model.yakumanTileBurst} />
        {seatOrder.map((seat) => {
          const seatView = model.seatMap[seat];

          return (
            <MatchPlayerHand
              key={seat}
              dimUnavailableTiles={model.isRiichiSelectionActive}
              discardActions={
                model.isRiichiSelectionActive
                  ? seatView?.playerId === model.riichiSelectionPlayerId
                    ? model.riichiActions
                    : []
                  : model.discardActions
              }
              hideLabel={seat === 'East' && model.hasVisibleButtonActions}
              isSubmitting={model.isSubmittingAction}
              isTurnPlayer={model.displayedTurnPlayerId === seatView?.playerId}
              onSubmitAction={model.submitActionAndClosePickers}
              playerName={
                seatView?.playerId ? model.playerNames[seatView.playerId] : undefined
              }
              seat={seat}
              seatView={seatView}
              showPrivateState={seatView?.playerId === model.operatorId}
              shouldForceBacks={shouldHideWinningHand({
                result: mahjongTable.currentRound?.result ?? null,
                resultHandRevealReadyKey: model.resultHandRevealReadyKey,
                resultKey: model.resultKey,
                seatView,
                winResultNeedsSequence: model.winResultNeedsSequence,
              })}
            />
          );
        })}

        {model.isSubmittingAction ||
        (mahjongTable.currentRound?.pendingCall &&
          model.hasCallResponseActions) ? (
          <div className="absolute left-1/2 top-[calc(50%+92px)] z-[16] -translate-x-1/2 rounded-2xl border border-[rgba(236,197,122,0.26)] bg-[rgba(7,18,28,0.78)] px-4 py-2 text-sm font-semibold text-[#ecc57a] shadow-[0_12px_30px_rgba(0,0,0,0.25)] backdrop-blur">
            {model.isSubmittingAction
              ? '提交中'
              : `可鸣牌：${mahjongTable.currentRound?.pendingCall?.tile ?? ''}`}
          </div>
        ) : null}

        <MatchActionBar
          actionError={model.actionError}
          actions={model.visibleLegalActions}
          isRiichiSelectionActive={model.isRiichiSelectionActive}
          isSubmitting={model.isSubmittingAction}
          onSubmitAction={model.submitActionAndClosePickers}
          onToggleRiichiSelection={model.toggleRiichiSelection}
        />

        {model.shouldShowResult ? (
          <MatchResultOverlay
            key={model.resultKey}
            onComplete={model.completeResultSequence}
            playerNames={model.playerNames}
            result={mahjongTable.currentRound?.result ?? null}
            scoreStepActionLabel={model.scoreStepActionLabel}
            seats={model.seats}
          />
        ) : null}
        {model.terminalSettlementTable &&
        !model.isLocalSettlementDisplayActive ? (
          <FinalSettlementOverlay
            mahjongTable={model.terminalSettlementTable}
            onConfirm={model.onConfirmFinalSettlement}
            playerNames={model.playerNames}
          />
        ) : null}
      </div>
    </section>
  );
}
