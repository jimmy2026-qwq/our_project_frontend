import type {
  AgariResult,
  MahjongLegalAction,
  MahjongPublicEventView,
  MahjongSeatView,
  MahjongTableView,
  SeatWind,
} from '@/objects';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CenterScoreDisplay } from '@/pages/TablePaifuPage/components/PaifuHandTable/components/CenterTable/CenterTable.types';
import {
  settlementAnimationDelayMs,
  settlementAnimationDurationMs,
} from '@/pages/TablePaifuPage/components/PaifuHandTable/functions/getPaifuHandTableReplay';
import {
  getWinYaku,
  getResultWins,
  isWinOutcome,
} from '@/pages/shared/mahjongResultSequence';
import { getFirstYakumanYaku } from '@/pages/shared/yakumanAnimation';
import { useMahjongTileImagePreload } from '@/pages/TablePaifuPage/components/PaifuHandTable/components/TileImagePreload';
import type {
  MeldGroup,
  RiverDiscard,
} from '@/pages/TablePaifuPage/objects/ReplaySnapshot.types';
import { PlayerRiver } from '@/pages/TablePaifuPage/components/PaifuHandTable/components/PlayerAreas/PlayerRiver';
import { OperationFlash } from '@/pages/TablePaifuPage/components/PaifuHandTable/components/PaifuOverlays/OperationFlash';
import type {
  ActiveOperation,
  YakumanTileBurstView,
  WinningCallFlashView,
} from '@/pages/TablePaifuPage/components/PaifuHandTable/components/PaifuOverlays/PaifuOverlays.types';
import { WinningCallFlash } from '@/pages/TablePaifuPage/components/PaifuHandTable/components/PaifuOverlays/WinningCallFlash';
import { YakumanTileBurstOverlay } from '@/pages/TablePaifuPage/components/PaifuHandTable/components/PaifuOverlays/YakumanTileBurstOverlay';
import type { TableDetail } from '@/pages/objects/TournamentViews';

import { MatchActionBar } from './MatchActionBar';
import { MatchCenterTable } from './MatchCenterTable';
import { FinalSettlementOverlay } from './FinalSettlementOverlay';
import { MatchMeldArea } from './MatchMeldArea';
import { MatchPlayerHand } from './MatchPlayerHand';
import { MatchResultOverlay } from './MatchResultOverlay';

const seatOrder: SeatWind[] = ['East', 'South', 'West', 'North'];

interface MatchBoardProps {
  actionError: string | null;
  finalSettlementTable: MahjongTableView | null;
  isSubmittingAction: boolean;
  mahjongAcceptedEvent: MahjongPublicEventView | null;
  mahjongTable: MahjongTableView;
  onConfirmFinalSettlement: () => void;
  onAdvanceRound: () => void | Promise<void>;
  onSubmitAction: (action: MahjongLegalAction) => void;
  operatorId: string;
  playerNames: Record<string, string>;
  showcaseMode: boolean;
  table: TableDetail;
}

export function MatchBoard({
  actionError,
  finalSettlementTable,
  isSubmittingAction,
  mahjongAcceptedEvent,
  mahjongTable: latestMahjongTable,
  onConfirmFinalSettlement,
  onAdvanceRound,
  onSubmitAction,
  operatorId,
  playerNames,
  showcaseMode,
  table,
}: MatchBoardProps) {
  useMahjongTileImagePreload();

  const [displayedMahjongTable, setDisplayedMahjongTable] =
    useState(latestMahjongTable);
  const pendingMahjongTableRef = useRef<MahjongTableView | null>(null);
  const mahjongTable = displayedMahjongTable;
  const seatRotation = getSeatRotation(mahjongTable, operatorId);
  const seatMap = getMahjongSeatMap(mahjongTable, seatRotation);
  const rivers = getRivers(mahjongTable, seatRotation);
  const melds = getMelds(mahjongTable, seatRotation);
  const legalActions = mahjongTable.legalActions ?? [];
  const roundKey = getCurrentRoundKey(mahjongTable);
  const latestRoundKey = getCurrentRoundKey(latestMahjongTable);
  const turnActionDelayKey = getTurnActionDelayKey(mahjongTable, operatorId);
  const resultKey = getResultKey(mahjongTable);
  const latestResultKey = getResultKey(latestMahjongTable);
  const [settlementAnimatingKey, setSettlementAnimatingKey] = useState<
    string | null
  >(null);
  const [settlementProgress, setSettlementProgress] = useState<
    number | undefined
  >(undefined);
  const [resultSequenceCompletedKey, setResultSequenceCompletedKey] = useState<
    string | null
  >(null);
  const [resultOverlayReadyKey, setResultOverlayReadyKey] = useState<
    string | null
  >(null);
  const [resultHandRevealReadyKey, setResultHandRevealReadyKey] = useState<
    string | null
  >(null);
  const [resultWinningCallRemovedKey, setResultWinningCallRemovedKey] =
    useState<string | null>(null);
  const [resultYakumanBurstActiveKey, setResultYakumanBurstActiveKey] =
    useState<string | null>(null);
  const [delayedTurnActionKey, setDelayedTurnActionKey] = useState<
    string | null
  >(null);
  const [isRiichiSelectionActive, setIsRiichiSelectionActive] = useState(false);
  const [isRelativeScoreMode, setIsRelativeScoreMode] = useState(false);
  const advanceStartedKeyRef = useRef<string | null>(null);
  const seats = useMemo(() => mahjongTable.seats ?? [], [mahjongTable.seats]);
  const winResultNeedsSequence = Boolean(
    mahjongTable.currentRound?.result &&
      isWinOutcome(mahjongTable.currentRound.result.outcome),
  );
  const isCurrentEastPlayer = seats.some(
    (seat) => seat.seat === 'East' && seat.playerId === operatorId,
  );
  const isLocalSettlementDisplayActive = Boolean(
    resultKey &&
      mahjongTable.currentRound?.result &&
      (resultSequenceCompletedKey !== resultKey ||
        settlementProgress === undefined ||
        settlementProgress < 1),
  );
  const shouldShowResult = Boolean(
    mahjongTable.currentRound?.result &&
      resultKey &&
      (!winResultNeedsSequence || resultOverlayReadyKey === resultKey) &&
      resultSequenceCompletedKey !== resultKey &&
      settlementAnimatingKey !== resultKey,
  );
  const scoreDisplays = useMemo(
    () =>
      createMatchScoreDisplays({
        result: mahjongTable.currentRound?.result ?? null,
        seatsByDisplaySeat: seatMap,
        settlementProgress,
      }),
    [mahjongTable.currentRound?.result, seatMap, settlementProgress],
  );
  const terminalSettlementTable =
    finalSettlementTable ??
    (mahjongTable.status === 'Finished' || mahjongTable.status === 'Archived'
      ? mahjongTable
      : null);
  const canAdvanceAfterSettlement =
    !terminalSettlementTable &&
    table.status !== 'Archived' &&
    mahjongTable.status !== 'Archived' &&
    mahjongTable.status !== 'Finished';
  const scoreStepActionLabel =
    table.status === 'Archived' || mahjongTable.status === 'Archived'
      ? '关闭结算'
      : shouldCompleteTableAfterCurrentResult(mahjongTable)
        ? '完成牌桌'
        : '进入下一局';
  const isTurnActionDelayActive = Boolean(
    turnActionDelayKey && delayedTurnActionKey === turnActionDelayKey,
  );
  const visibleLegalActions = isTurnActionDelayActive ? [] : legalActions;
  const hasVisibleButtonActions = visibleLegalActions.some(
    (action) => action.commandType !== 'Discard',
  );
  const displayedTurnPlayerId = isTurnActionDelayActive
    ? null
    : mahjongTable.currentRound?.turnPlayerId;
  const discardActions = visibleLegalActions.filter(
    (action) => action.commandType === 'Discard',
  );
  const riichiActions = visibleLegalActions.filter(
    (action) => action.commandType === 'Riichi',
  );
  const riichiSelectionPlayerId = mahjongTable.currentRound?.turnPlayerId;
  const hasCallResponseActions = legalActions.some(isCallResponseAction);
  const submitActionAndClosePickers = useCallback(
    (action: MahjongLegalAction) => {
      setIsRiichiSelectionActive(false);
      onSubmitAction(action);
    },
    [onSubmitAction],
  );
  const activeOperation = useMemo(
    () =>
      createMatchActiveOperation({
        event: mahjongAcceptedEvent,
        result: mahjongTable.currentRound?.result ?? null,
        seatRotation,
        seats,
      }),
    [mahjongAcceptedEvent, mahjongTable.currentRound?.result, seatRotation, seats],
  );
  const winningCallFlash = useMemo(
    () =>
      createMatchWinningCallFlash({
        result: mahjongTable.currentRound?.result ?? null,
        resultKey,
        resultWinningCallRemovedKey,
        seatRotation,
        seats,
      }),
    [
      mahjongTable.currentRound?.result,
      resultKey,
      resultWinningCallRemovedKey,
      seatRotation,
      seats,
    ],
  );
  const riichiCallFlash = useMemo(
    () =>
      createMatchRiichiCallFlash({
        event: mahjongAcceptedEvent,
        seatRotation,
        seats,
      }),
    [mahjongAcceptedEvent, seatRotation, seats],
  );
  const yakumanTileBurst = useMemo(
    () =>
      createMatchYakumanTileBurst({
        result: mahjongTable.currentRound?.result ?? null,
        resultKey,
        resultYakumanBurstActiveKey,
        seats,
      }),
    [
      mahjongTable.currentRound?.result,
      resultKey,
      resultYakumanBurstActiveKey,
      seats,
    ],
  );

  useEffect(() => {
    const isIncomingDifferentRound =
      latestRoundKey !== roundKey || latestResultKey !== resultKey;

    if (isLocalSettlementDisplayActive && isIncomingDifferentRound) {
      pendingMahjongTableRef.current = latestMahjongTable;
      return;
    }

    pendingMahjongTableRef.current = null;
    setDisplayedMahjongTable(latestMahjongTable);
  }, [
    isLocalSettlementDisplayActive,
    latestMahjongTable,
    latestResultKey,
    latestRoundKey,
    resultKey,
    roundKey,
  ]);

  useEffect(() => {
    if (isLocalSettlementDisplayActive || !pendingMahjongTableRef.current) {
      return;
    }

    const pendingTable = pendingMahjongTableRef.current;
    pendingMahjongTableRef.current = null;
    setDisplayedMahjongTable(pendingTable);
  }, [isLocalSettlementDisplayActive]);

  useEffect(() => {
    if (!turnActionDelayKey) {
      setDelayedTurnActionKey(null);
      return;
    }

    setDelayedTurnActionKey(turnActionDelayKey);
    const timer = window.setTimeout(() => {
      setDelayedTurnActionKey((currentKey) =>
        currentKey === turnActionDelayKey ? null : currentKey,
      );
    }, getCallMaskDelayMs());

    return () => {
      window.clearTimeout(timer);
    };
  }, [turnActionDelayKey]);

  useEffect(() => {
    if (riichiActions.length === 0) {
      setIsRiichiSelectionActive(false);
    }
  }, [riichiActions.length]);

  useEffect(() => {
    setIsRelativeScoreMode(false);
  }, [roundKey]);

  useEffect(() => {
    if (settlementProgress !== undefined) {
      setIsRelativeScoreMode(false);
    }
  }, [settlementProgress]);

  useEffect(() => {
    if (!resultKey) {
      setSettlementAnimatingKey(null);
      setResultSequenceCompletedKey(null);
      setResultHandRevealReadyKey(null);
      setResultOverlayReadyKey(null);
      setResultWinningCallRemovedKey(null);
      setResultYakumanBurstActiveKey(null);
      setSettlementProgress(undefined);
      advanceStartedKeyRef.current = null;
      return;
    }

    setSettlementAnimatingKey(null);
    setResultSequenceCompletedKey(null);
    setResultHandRevealReadyKey(null);
    setResultOverlayReadyKey(null);
    setResultWinningCallRemovedKey(null);
    setResultYakumanBurstActiveKey(null);
    setSettlementProgress(undefined);
  }, [resultKey]);

  useEffect(() => {
    if (!resultKey || !winResultNeedsSequence) {
      setResultHandRevealReadyKey(resultKey);
      setResultOverlayReadyKey(resultKey);
      setResultWinningCallRemovedKey(resultKey);
      setResultYakumanBurstActiveKey(null);
      return;
    }

    const hasYakumanBurst = Boolean(
      createMatchYakumanTileBurstData({
        result: mahjongTable.currentRound?.result ?? null,
        seats,
      }),
    );

    setResultHandRevealReadyKey(resultKey);
    setResultOverlayReadyKey(null);
    setResultWinningCallRemovedKey(null);
    setResultYakumanBurstActiveKey(null);
    const flashTimer = window.setTimeout(() => {
      setResultWinningCallRemovedKey(resultKey);
    }, winningCallVisibleMs);
    const yakumanBurstStartTimer = hasYakumanBurst
      ? window.setTimeout(() => {
          setResultYakumanBurstActiveKey(resultKey);
        }, winningCallVisibleMs)
      : undefined;
    const yakumanBurstEndTimer = hasYakumanBurst
      ? window.setTimeout(() => {
          setResultYakumanBurstActiveKey((currentKey) =>
            currentKey === resultKey ? null : currentKey,
          );
        }, winningCallVisibleMs + yakumanTileBurstVisibleMs)
      : undefined;
    const overlayTimer = window.setTimeout(() => {
      setResultOverlayReadyKey(resultKey);
    }, hasYakumanBurst
      ? winningCallVisibleMs +
          yakumanTileBurstVisibleMs +
          yakumanTileBurstSettleDelayMs
      : resultRevealDelayMs);

    return () => {
      window.clearTimeout(flashTimer);
      if (yakumanBurstStartTimer) {
        window.clearTimeout(yakumanBurstStartTimer);
      }
      if (yakumanBurstEndTimer) {
        window.clearTimeout(yakumanBurstEndTimer);
      }
      window.clearTimeout(overlayTimer);
    };
  }, [mahjongTable.currentRound?.result, resultKey, seats, winResultNeedsSequence]);

  useEffect(() => {
    if (!resultKey) {
      return;
    }

    if (resultSequenceCompletedKey !== resultKey) {
      return;
    }

    let animationFrame = 0;
    const timer = window.setTimeout(() => {
      setSettlementAnimatingKey(resultKey);
      const startedAt = performance.now();

      const animate = (now: number) => {
        const elapsed = now - startedAt;
        const progress = Math.min(
          1,
          Math.max(0, elapsed - settlementAnimationDelayMs) /
            settlementAnimationDurationMs,
        );

        setSettlementProgress(progress);

        if (
          elapsed <
          settlementAnimationDelayMs + settlementAnimationDurationMs
        ) {
          animationFrame = window.requestAnimationFrame(animate);
          return;
        }

        setSettlementProgress(1);
        if (
          canAdvanceAfterSettlement &&
          isCurrentEastPlayer &&
          advanceStartedKeyRef.current !== resultKey
        ) {
          advanceStartedKeyRef.current = resultKey;
          void Promise.resolve(onAdvanceRound());
        }
      };

      animationFrame = window.requestAnimationFrame(animate);
    }, settlementAnimationStartDelayMs);

    return () => {
      window.clearTimeout(timer);
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, [
    onAdvanceRound,
    canAdvanceAfterSettlement,
    isCurrentEastPlayer,
    resultKey,
    resultSequenceCompletedKey,
  ]);

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
          {showcaseMode ? (
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
          isRelativeScoreMode={isRelativeScoreMode}
          mahjongTable={mahjongTable}
          onToggleRelativeScoreMode={() =>
            setIsRelativeScoreMode((value) => !value)
          }
          scoreDisplays={scoreDisplays}
          seatsByDisplaySeat={seatMap}
        />

        {seatOrder.map((seat) => (
          <PlayerRiver key={`${seat}-river`} rivers={rivers} seat={seat} />
        ))}
        <MatchMeldArea melds={melds} />
        <OperationFlash
          operation={
            winningCallFlash || riichiCallFlash || winResultNeedsSequence
              ? undefined
              : activeOperation
          }
        />
        <WinningCallFlash flash={winningCallFlash ?? riichiCallFlash} />
        <YakumanTileBurstOverlay burst={yakumanTileBurst} />
        {seatOrder.map((seat) => (
          <MatchPlayerHand
            key={seat}
            dimUnavailableTiles={isRiichiSelectionActive}
            discardActions={
              isRiichiSelectionActive
                ? seatMap[seat]?.playerId === riichiSelectionPlayerId
                  ? riichiActions
                  : []
                : discardActions
            }
            hideLabel={seat === 'East' && hasVisibleButtonActions}
            isSubmitting={isSubmittingAction}
            isTurnPlayer={displayedTurnPlayerId === seatMap[seat]?.playerId}
            onSubmitAction={submitActionAndClosePickers}
            playerName={
              seatMap[seat]?.playerId
                ? playerNames[seatMap[seat].playerId]
                : undefined
            }
            seat={seat}
            seatView={seatMap[seat]}
            showPrivateState={seatMap[seat]?.playerId === operatorId}
            shouldForceBacks={shouldHideWinningHand({
              result: mahjongTable.currentRound?.result ?? null,
              resultHandRevealReadyKey,
              resultKey,
              seatView: seatMap[seat],
              winResultNeedsSequence,
            })}
          />
        ))}

        {isSubmittingAction ||
        (mahjongTable.currentRound?.pendingCall && hasCallResponseActions) ? (
          <div className="absolute left-1/2 top-[calc(50%+92px)] z-[16] -translate-x-1/2 rounded-2xl border border-[rgba(236,197,122,0.26)] bg-[rgba(7,18,28,0.78)] px-4 py-2 text-sm font-semibold text-[#ecc57a] shadow-[0_12px_30px_rgba(0,0,0,0.25)] backdrop-blur">
            {isSubmittingAction
              ? '提交中'
              : `可鸣牌：${mahjongTable.currentRound?.pendingCall?.tile ?? ''}`}
          </div>
        ) : null}

        <MatchActionBar
          actionError={actionError}
          actions={visibleLegalActions}
          isRiichiSelectionActive={isRiichiSelectionActive}
          isSubmitting={isSubmittingAction}
          onSubmitAction={submitActionAndClosePickers}
          onToggleRiichiSelection={() =>
            setIsRiichiSelectionActive((value) => !value)
          }
        />

        {shouldShowResult ? (
          <MatchResultOverlay
            key={resultKey}
            onComplete={() => {
              if (resultKey) {
                setResultSequenceCompletedKey(resultKey);
              }
            }}
            playerNames={playerNames}
            result={mahjongTable.currentRound?.result ?? null}
            scoreStepActionLabel={scoreStepActionLabel}
            seats={seats}
          />
        ) : null}
        {terminalSettlementTable && !isLocalSettlementDisplayActive ? (
          <FinalSettlementOverlay
            mahjongTable={terminalSettlementTable}
            onConfirm={onConfirmFinalSettlement}
            playerNames={playerNames}
          />
        ) : null}
      </div>
    </section>
  );
}

const settlementAnimationStartDelayMs = 0;
const winningCallAnimationMs = 500;
const winningCallVisibleMs = 1500;
const winningCallSettlementWaitMs = 1500;
const resultRevealDelayMs = winningCallAnimationMs + winningCallSettlementWaitMs;
const yakumanTileBurstVisibleMs = 4200;
const yakumanTileBurstSettleDelayMs = 500;
const callMaskDelayMinMs = 650;
const callMaskDelayRangeMs = 1350;

function getTurnActionDelayKey(
  mahjongTable: MahjongTableView,
  operatorId: string,
) {
  const round = mahjongTable.currentRound;

  if (
    !operatorId ||
    !round ||
    round.phase !== 'PlayerTurn' ||
    round.turnPlayerId !== operatorId
  ) {
    return null;
  }

  const actions = mahjongTable.legalActions ?? [];

  if (
    !actions.some((action) => action.commandType === 'Discard') ||
    actions.some(isCallResponseAction)
  ) {
    return null;
  }

  return [
    mahjongTable.tableId,
    round.descriptor.roundWind,
    round.descriptor.handNumber,
    round.descriptor.honba,
    mahjongTable.lastEventSequenceNo,
    operatorId,
  ].join(':');
}

function getCurrentRoundKey(mahjongTable: MahjongTableView) {
  const round = mahjongTable.currentRound;

  if (!round) {
    return 'no-round';
  }

  return [
    mahjongTable.tableId,
    round.descriptor.roundWind,
    round.descriptor.handNumber,
    round.descriptor.honba,
  ].join(':');
}

function isCallResponseAction(action: MahjongLegalAction) {
  return (
    action.commandType === 'Chi' ||
    action.commandType === 'Pon' ||
    action.commandType === 'OpenKan' ||
    action.commandType === 'Ron' ||
    action.commandType === 'Pass'
  );
}

function getCallMaskDelayMs() {
  return callMaskDelayMinMs + Math.floor(Math.random() * callMaskDelayRangeMs);
}

function shouldCompleteTableAfterCurrentResult(mahjongTable: MahjongTableView) {
  const result = mahjongTable.currentRound?.result;

  if (!result) {
    return false;
  }

  if (
    mahjongTable.status === 'Finished' ||
    mahjongTable.status === 'Archived'
  ) {
    return true;
  }

  if (
    mahjongTable.ruleset.bankruptcyEnd &&
    mahjongTable.seats.some((seat) => seat.points < 0)
  ) {
    return true;
  }

  if (mahjongTable.ruleset.gameLength === 'OneKyoku') {
    return true;
  }

  const descriptor = mahjongTable.currentRound?.descriptor;

  if (!descriptor) {
    return false;
  }

  return (
    !doesDealerContinueAfterCurrentResult(mahjongTable) &&
    isAtOrBeyondLastScheduledHand(
      descriptor,
      mahjongTable.ruleset.gameLength,
    ) &&
    mahjongTable.seats.some(
      (seat) => seat.points >= mahjongTable.ruleset.targetPoints,
    )
  );
}

function doesDealerContinueAfterCurrentResult(mahjongTable: MahjongTableView) {
  const result = mahjongTable.currentRound?.result;
  const eastPlayerId = mahjongTable.seats.find(
    (seat) => seat.seat === 'East',
  )?.playerId;

  if (!result || !eastPlayerId) {
    return false;
  }

  if (isWinOutcome(result.outcome)) {
    return getResultWins(result).some((win) => win.winner === eastPlayerId);
  }

  if (result.outcome === 'ExhaustiveDraw') {
    return Boolean(result.tenpaiPlayerIds?.includes(eastPlayerId));
  }

  if (result.outcome === 'AbortiveDraw') {
    return true;
  }

  return false;
}

function isAtOrBeyondLastScheduledHand(
  descriptor: NonNullable<MahjongTableView['currentRound']>['descriptor'],
  gameLength: MahjongTableView['ruleset']['gameLength'],
) {
  return (
    descriptor.handNumber >= 4 &&
    getRoundWindOrder(descriptor.roundWind) >=
      getRoundWindOrder(getLastScheduledRoundWind(gameLength))
  );
}

function getLastScheduledRoundWind(
  gameLength: MahjongTableView['ruleset']['gameLength'],
): SeatWind {
  return gameLength === 'Hanchan' ? 'South' : 'East';
}

function getRoundWindOrder(seat: SeatWind) {
  return seatOrder.indexOf(seat);
}

function getResultKey(mahjongTable: MahjongTableView) {
  const result = mahjongTable.currentRound?.result;

  if (!result) {
    return null;
  }

  return [
    mahjongTable.tableId,
    mahjongTable.lastEventSequenceNo,
    result.outcome,
    result.winner,
    result.target,
    result.points,
    (result.wins ?? [])
      .map((win) => `${win.winner}:${win.target ?? ''}:${win.points}`)
      .join('|'),
  ].join(':');
}

function createMatchActiveOperation({
  event,
  result,
  seatRotation,
  seats,
}: {
  event: MahjongPublicEventView | null;
  result: AgariResult | null;
  seatRotation: Record<SeatWind, SeatWind>;
  seats: MahjongSeatView[];
}): ActiveOperation | undefined {
  if (!event?.actor) {
    return undefined;
  }

  const seat = seats.find((seatView) => seatView.playerId === event.actor)?.seat;
  const label = getMatchOperationLabel(event, result);

  if (!seat || !label) {
    return undefined;
  }

  return {
    key: event.sequenceNo,
    label,
    seat: seatRotation[seat],
  };
}

function createMatchWinningCallFlash({
  result,
  resultKey,
  resultWinningCallRemovedKey,
  seatRotation,
  seats,
}: {
  result: AgariResult | null;
  resultKey: string | null;
  resultWinningCallRemovedKey: string | null;
  seatRotation: Record<SeatWind, SeatWind>;
  seats: MahjongSeatView[];
}): WinningCallFlashView | undefined {
  if (
    !result ||
    !resultKey ||
    resultWinningCallRemovedKey === resultKey ||
    !isWinOutcome(result.outcome)
  ) {
    return undefined;
  }

  const winnerId = getResultWins(result)[0]?.winner ?? result.winner;
  const seat = seats.find((seatView) => seatView.playerId === winnerId)?.seat;

  if (!seat) {
    return undefined;
  }

  return {
    animationMs: winningCallAnimationMs,
    key: resultKey,
    label: result.outcome === 'Tsumo' ? '\u81ea\u6478' : '\u548c',
    seat: seatRotation[seat],
  };
}

function createMatchRiichiCallFlash({
  event,
  seatRotation,
  seats,
}: {
  event: MahjongPublicEventView | null;
  seatRotation: Record<SeatWind, SeatWind>;
  seats: MahjongSeatView[];
}): WinningCallFlashView | undefined {
  if (event?.actionType !== 'Riichi' || !event.actor) {
    return undefined;
  }

  const seat = seats.find((seatView) => seatView.playerId === event.actor)?.seat;

  if (!seat) {
    return undefined;
  }

  return {
    animationMs: winningCallAnimationMs,
    key: event.sequenceNo,
    label: getRiichiCallLabel(event.note),
    seat: seatRotation[seat],
    variant: 'riichi',
  };
}

function createMatchYakumanTileBurst({
  result,
  resultKey,
  resultYakumanBurstActiveKey,
  seats,
}: {
  result: AgariResult | null;
  resultKey: string | null;
  resultYakumanBurstActiveKey: string | null;
  seats: MahjongSeatView[];
}): YakumanTileBurstView | undefined {
  if (!resultKey || resultYakumanBurstActiveKey !== resultKey) {
    return undefined;
  }

  const burst = createMatchYakumanTileBurstData({ result, seats });

  if (!burst) {
    return undefined;
  }

  return {
    key: resultKey,
    ...burst,
  };
}

function createMatchYakumanTileBurstData({
  result,
  seats,
}: {
  result: AgariResult | null;
  seats: MahjongSeatView[];
}): Omit<YakumanTileBurstView, 'key'> | undefined {
  if (!result || !isWinOutcome(result.outcome)) {
    return undefined;
  }

  for (const win of getResultWins(result)) {
    const yakumanYaku = getFirstYakumanYaku(getWinYaku(result, win));

    if (!yakumanYaku) {
      continue;
    }

    const winnerSeat = seats.find(
      (seatView) => seatView.playerId === win.winner,
    );
    const targetSeat = win.target
      ? seats.find((seatView) => seatView.playerId === win.target)
      : result.target
        ? seats.find((seatView) => seatView.playerId === result.target)
        : undefined;
    const featuredTile = getYakumanFeaturedTile({
      result,
      targetSeat,
      winnerSeat,
    });
    const tiles = getYakumanBurstTiles({
      featuredTile,
      winnerSeat,
    });

    if (tiles.length === 0) {
      return undefined;
    }

    return {
      featuredTile,
      tiles,
      yakuKind: yakumanYaku.kind,
    };
  }

  return undefined;
}

function getYakumanBurstTiles({
  featuredTile,
  winnerSeat,
}: {
  featuredTile?: string;
  winnerSeat?: MahjongSeatView;
}) {
  const handTiles = winnerSeat?.handTiles ?? [];

  return featuredTile
    ? [featuredTile, ...removeFirstMatchingTile(handTiles, featuredTile)].slice(0, 14)
    : handTiles.slice(0, 14);
}

function getYakumanFeaturedTile({
  result,
  targetSeat,
  winnerSeat,
}: {
  result: AgariResult;
  targetSeat?: MahjongSeatView;
  winnerSeat?: MahjongSeatView;
}) {
  if (result.outcome === 'Tsumo') {
    return winnerSeat?.drawTile ?? undefined;
  }

  if (result.outcome === 'Ron') {
    return targetSeat?.river?.[targetSeat.river.length - 1]?.tile;
  }

  return undefined;
}

function shouldHideWinningHand({
  result,
  resultHandRevealReadyKey,
  resultKey,
  seatView,
  winResultNeedsSequence,
}: {
  result: AgariResult | null;
  resultHandRevealReadyKey: string | null;
  resultKey: string | null;
  seatView: MahjongSeatView | null;
  winResultNeedsSequence: boolean;
}) {
  if (
    !result ||
    !resultKey ||
    !seatView?.playerId ||
    !winResultNeedsSequence ||
    resultHandRevealReadyKey === resultKey
  ) {
    return false;
  }

  return getResultWins(result).some((win) => win.winner === seatView.playerId);
}

function getMatchOperationLabel(
  event: MahjongPublicEventView,
  result: AgariResult | null,
) {
  switch (event.actionType) {
    case 'Chi':
      return '吃';
    case 'Pon':
      return '碰';
    case 'Kan':
    case 'OpenKan':
    case 'ClosedKan':
    case 'AddedKan':
      return '杠';
    case 'Riichi':
      return undefined;
    case 'Win':
      return result?.outcome === 'Tsumo' ? '自摸' : '荣';
    default:
      return undefined;
  }
}

function getRiichiCallLabel(note?: string | null) {
  const normalizedNote = note ?? '';

  return normalizedNote.toLowerCase().includes('double riichi') ||
    normalizedNote.includes('两立直')
    ? '两立直'
    : '立直';
}

function createMatchScoreDisplays({
  result,
  seatsByDisplaySeat,
  settlementProgress,
}: {
  result: AgariResult | null;
  seatsByDisplaySeat: Record<SeatWind, MahjongSeatView | null>;
  settlementProgress?: number;
}) {
  if (!result || settlementProgress === undefined) {
    return undefined;
  }

  return Object.fromEntries(
    seatOrder.map((seat) => {
      const seatView = seatsByDisplaySeat[seat];
      const delta =
        result.scoreChanges.find((change) => change.playerId === seatView?.playerId)
          ?.delta ?? 0;
      const finalPoints = seatView?.points ?? 0;
      const basePoints = finalPoints - delta;
      const animatedDelta = normalizeZero(
        Math.round(delta * (1 - settlementProgress)),
      );
      const hasScoreDelta = result.scoreChanges.some(
        (change) => change.delta !== 0,
      );

      return [
        seat,
        {
          delta: animatedDelta,
          points: basePoints + Math.round(delta * settlementProgress),
          showDelta:
            isScoreSettlementOutcome(result.outcome) &&
            hasScoreDelta &&
            settlementProgress < 1,
        },
      ];
    }),
  ) as Record<SeatWind, CenterScoreDisplay>;
}

function normalizeZero(value: number) {
  return Object.is(value, -0) ? 0 : value;
}

function isScoreSettlementOutcome(outcome: string) {
  return outcome === 'Ron' || outcome === 'Tsumo' || outcome === 'ExhaustiveDraw';
}

function getMahjongSeatMap(
  mahjongTable: MahjongTableView,
  seatRotation: Record<SeatWind, SeatWind>,
) {
  return seatOrder.reduce(
    (seatMap, seat) => ({
      ...seatMap,
      [seat]:
        (mahjongTable.seats ?? []).find(
          (seatView) => seatRotation[seatView.seat] === seat,
        ) ?? null,
    }),
    {} as Record<SeatWind, MahjongSeatView | null>,
  );
}

function getRivers(
  mahjongTable: MahjongTableView,
  seatRotation: Record<SeatWind, SeatWind>,
) {
  return createSeatRecord((displaySeat) => {
    const seatView = (mahjongTable.seats ?? []).find(
      (item) => seatRotation[item.seat] === displaySeat,
    );

    return (
      (seatView?.river ?? []).filter((discard) => !discard.calledBy).map(
        (discard): RiverDiscard => ({
          playerId: discard.playerId,
          sequenceNo: discard.sequenceNo,
          sideways: discard.riichiDeclared,
          tile: discard.tile,
        }),
      ) ?? []
    );
  });
}

function getMelds(
  mahjongTable: MahjongTableView,
  seatRotation: Record<SeatWind, SeatWind>,
) {
  return createSeatRecord((displaySeat) => {
    const seatView = (mahjongTable.seats ?? []).find(
      (item) => seatRotation[item.seat] === displaySeat,
    );

    if (!seatView) {
      return [];
    }

    return (
      (seatView.melds ?? []).map((meld): MeldGroup => {
        const sourceTiles = meld.tiles ?? [];
        const claimedActualSeat = (mahjongTable.seats ?? []).find(
          (seat) => seat.playerId === meld.fromPlayer,
        )?.seat;
        const claimedDisplaySeat = claimedActualSeat
          ? seatRotation[claimedActualSeat]
          : undefined;
        const sidewaysIndex = getMeldSidewaysIndex({
          claimedSeat: claimedDisplaySeat,
          meldType: meld.meldType,
          seat: displaySeat,
          tileCount: sourceTiles.length,
        });
        const tiles = getMeldDisplaySourceTiles(meld, sidewaysIndex);

        return {
          actionType: meld.meldType,
          tiles: tiles.map((tile, index) => ({
            concealed: meld.closed && (index === 0 || index === tiles.length - 1),
            sideways: !meld.closed && index === sidewaysIndex,
            tile,
          })),
        };
      }) ?? []
    );
  });
}

function getMeldDisplaySourceTiles(
  meld: MahjongSeatView['melds'][number],
  sidewaysIndex?: number,
) {
  const tiles = meld.tiles ?? [];

  if (!meld.calledTile || sidewaysIndex === undefined) {
    return tiles;
  }

  const handTiles = removeFirstMatchingTile(tiles, meld.calledTile);

  return [
    ...handTiles.slice(0, sidewaysIndex),
    meld.calledTile,
    ...handTiles.slice(sidewaysIndex),
  ];
}

function removeFirstMatchingTile(tiles: string[], tile: string) {
  let removed = false;

  return tiles.filter((item) => {
    if (!removed && item === tile) {
      removed = true;
      return false;
    }

    return true;
  });
}

function getMeldSidewaysIndex({
  claimedSeat,
  meldType,
  seat,
  tileCount,
}: {
  claimedSeat?: SeatWind;
  meldType: string;
  seat: SeatWind;
  tileCount: number;
}) {
  if (meldType === 'Chi') {
    return 0;
  }

  if (!claimedSeat) {
    return undefined;
  }

  return getSidewaysIndexByRelation(
    getClaimRelation(seat, claimedSeat),
    tileCount,
  );
}

function getSidewaysIndexByRelation(relation: string, tileCount: number) {
  if (tileCount >= 4) {
    if (relation === 'upper') {
      return 0;
    }

    if (relation === 'opposite') {
      return 1;
    }

    if (relation === 'lower') {
      return 3;
    }
  }

  if (relation === 'upper') {
    return 0;
  }

  if (relation === 'opposite') {
    return 1;
  }

  if (relation === 'lower') {
    return 2;
  }

  return undefined;
}

function getClaimRelation(callerSeat: SeatWind, claimedSeat: SeatWind) {
  const callerIndex = seatOrder.indexOf(callerSeat);
  const claimedIndex = seatOrder.indexOf(claimedSeat);
  const relation =
    (claimedIndex - callerIndex + seatOrder.length) % seatOrder.length;

  if (relation === 3) {
    return 'upper';
  }

  if (relation === 2) {
    return 'opposite';
  }

  if (relation === 1) {
    return 'lower';
  }

  return 'self';
}

function createSeatRecord<T>(factory: (seat: SeatWind) => T) {
  return seatOrder.reduce(
    (record, seat) => ({
      ...record,
      [seat]: factory(seat),
    }),
    {} as Record<SeatWind, T>,
  );
}

function getSeatRotation(
  mahjongTable: MahjongTableView,
  operatorId: string,
): Record<SeatWind, SeatWind> {
  const viewerSeat =
    (mahjongTable.seats ?? []).find((seat) => seat.playerId === operatorId)
      ?.seat ?? 'East';

  return createSeatRotation(viewerSeat);
}

function createSeatRotation(viewerSeat: SeatWind): Record<SeatWind, SeatWind> {
  const viewerIndex = seatOrder.indexOf(viewerSeat);

  return seatOrder.reduce(
    (rotation, actualSeat, actualIndex) => ({
      ...rotation,
      [actualSeat]:
        seatOrder[(actualIndex - viewerIndex + seatOrder.length) % seatOrder.length],
    }),
    {} as Record<SeatWind, SeatWind>,
  );
}
