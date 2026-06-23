import { useEffect, useMemo, useState } from 'react';

import { getPlayerDisplayName, getRoundPlayerId } from '../../../functions/getReplayPlayers';
import { HandOutcome, SeatWind, type PaifuRound as PaifuRoundSummary } from '@/objects';
import type { TablePaifuDetail } from '../../../objects/TablePaifuDetail';
import { createPerspectivePaifu, getInitialPerspectiveSeat, getNextPerspectiveSeat, getPaifuRoundKey } from '../functions/getPaifuHandTablePerspective';
import { HandVisibilityMode } from '@/pages/TablePaifuPage/components/PaifuHandTable/objects/HandVisibilityMode';
import type { PaifuHandTableProps } from '../objects/PaifuHandTableProps';
import { useMahjongTileImagePreload } from './useMahjongTileImagePreload';
import { usePaifuHandTableReplay } from './usePaifuHandTableReplay';

export function usePaifuHandTable({
  paifu,
  round,
  rounds,
  selectedRoundIndex,
  viewerPlayerId,
}: PaifuHandTableProps) {
  useMahjongTileImagePreload();
  const isReady = Boolean(paifu && round);
  const activePaifu = paifu ?? emptyTablePaifu;
  const activeRound = round ?? emptyPaifuRound;

  const [handVisibilityMode, setHandVisibilityMode] =
    useState<HandVisibilityMode>(HandVisibilityMode.Self);
  const [perspectiveSeat, setPerspectiveSeat] = useState(() =>
    getInitialPerspectiveSeat(activePaifu, viewerPlayerId),
  );
  const [isRelativeScoreMode, setIsRelativeScoreMode] = useState(false);
  const [isFinalSettlementOpen, setIsFinalSettlementOpen] = useState(false);

  useEffect(() => {
    setPerspectiveSeat(getInitialPerspectiveSeat(activePaifu, viewerPlayerId));
  }, [activePaifu, viewerPlayerId]);

  const displayPaifu = useMemo(
    () => createPerspectivePaifu(activePaifu, perspectiveSeat),
    [activePaifu, perspectiveSeat],
  );
  const roundKey = getPaifuRoundKey(activeRound);
  const replay = usePaifuHandTableReplay({
    paifu: displayPaifu,
    round: activeRound,
    rounds,
    selectedRoundIndex,
  });

  useEffect(() => {
    setIsRelativeScoreMode(false);
  }, [perspectiveSeat, roundKey]);

  useEffect(() => {
    if (replay.isSettlementAnimating) {
      setIsRelativeScoreMode(false);
    }
  }, [replay.isSettlementAnimating]);

  const selfPlayerId = getRoundPlayerId(displayPaifu, SeatWind.East);
  const perspectiveLabel = selfPlayerId
    ? `视角：${getPlayerDisplayName(displayPaifu, selfPlayerId)}`
    : '视角：东家';

  const tableState = {
    displayPaifu,
    handVisibilityMode,
    isFinalSettlementOpen,
    isRelativeScoreMode,
    onCyclePerspective: () =>
      setPerspectiveSeat((seat) => getNextPerspectiveSeat(activePaifu, seat)),
    onToggleHandVisibility: () =>
      setHandVisibilityMode((mode) =>
        mode === HandVisibilityMode.Self
          ? HandVisibilityMode.All
          : HandVisibilityMode.Self,
      ),
    onToggleRelativeScoreMode: () => setIsRelativeScoreMode((value) => !value),
    perspectiveLabel,
    replay,
    selfPlayerId,
    setIsFinalSettlementOpen,
  };

  return isReady ? tableState : null;
}

const emptyPaifuRound: PaifuRoundSummary = {
  descriptor: {
    handNumber: 1,
    honba: 0,
    roundWind: SeatWind.East,
  },
  players: [],
  result: {
    doraIndicators: null,
    fu: null,
    han: null,
    outcome: HandOutcome.AbortiveDraw,
    points: 0,
    scoreChanges: [],
    settlement: null,
    target: null,
    tenpaiPlayerIds: null,
    uraDoraIndicators: null,
    uraDoraVisible: null,
    winner: null,
    wins: [],
    yaku: [],
  },
  timeline: {
    events: [],
  },
};

const emptyTablePaifu: TablePaifuDetail = {
  finalStandings: [],
  id: '',
  metadata: {
    matchRecordId: null,
    recordedAt: '',
    seats: [],
    source: '',
    stageId: '',
    tableId: '',
    tournamentId: '',
  },
  rounds: [],
};
