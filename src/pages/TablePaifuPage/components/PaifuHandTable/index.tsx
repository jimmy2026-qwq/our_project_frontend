import { useEffect, useMemo, useState } from 'react';

import { getPlayerDisplayName, getRoundPlayerId } from '../../functions/getReplay';
import {
  createPerspectivePaifu,
  getInitialPerspectiveSeat,
  getNextPerspectiveSeat,
  getPaifuRoundKey,
} from './functions/getPaifuHandTablePerspective';
import { usePaifuHandTableReplay } from './hooks/usePaifuHandTableReplay';
import type { HandVisibilityMode } from './objects/HandVisibilityMode';
import type { PaifuHandTableProps } from './objects/PaifuHandTableProps';
import { PaifuHandTableView } from './PaifuHandTableView';
import { useMahjongTileImagePreload } from './components/TileImagePreload';

export function PaifuHandTable({
  onSelectRound,
  paifu,
  round,
  rounds,
  selectedRoundIndex,
  viewerPlayerId,
}: PaifuHandTableProps) {
  useMahjongTileImagePreload();

  const [handVisibilityMode, setHandVisibilityMode] =
    useState<HandVisibilityMode>('self');
  const [perspectiveSeat, setPerspectiveSeat] = useState(() =>
    getInitialPerspectiveSeat(paifu, viewerPlayerId),
  );
  const [isRelativeScoreMode, setIsRelativeScoreMode] = useState(false);
  const [isFinalSettlementOpen, setIsFinalSettlementOpen] = useState(false);

  useEffect(() => {
    setPerspectiveSeat(getInitialPerspectiveSeat(paifu, viewerPlayerId));
  }, [paifu.id, viewerPlayerId]);

  const displayPaifu = useMemo(
    () => createPerspectivePaifu(paifu, perspectiveSeat),
    [paifu, perspectiveSeat],
  );
  const roundKey = getPaifuRoundKey(round);
  const replay = usePaifuHandTableReplay({
    paifu: displayPaifu,
    round,
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

  const selfPlayerId = getRoundPlayerId(displayPaifu, 'East');
  const perspectiveLabel = selfPlayerId
    ? `视角：${getPlayerDisplayName(displayPaifu, selfPlayerId)}`
    : '视角：东家';

  return (
    <PaifuHandTableView
      displayPaifu={displayPaifu}
      handVisibilityMode={handVisibilityMode}
      isFinalSettlementOpen={isFinalSettlementOpen}
      isRelativeScoreMode={isRelativeScoreMode}
      onCyclePerspective={() =>
        setPerspectiveSeat((seat) => getNextPerspectiveSeat(paifu, seat))
      }
      onSelectRound={onSelectRound}
      onToggleHandVisibility={() =>
        setHandVisibilityMode((mode) => (mode === 'self' ? 'all' : 'self'))
      }
      onToggleRelativeScoreMode={() => setIsRelativeScoreMode((value) => !value)}
      paifu={paifu}
      perspectiveLabel={perspectiveLabel}
      replay={replay}
      round={round}
      rounds={rounds}
      selectedRoundIndex={selectedRoundIndex}
      selfPlayerId={selfPlayerId}
      setIsFinalSettlementOpen={setIsFinalSettlementOpen}
    />
  );
}
