import type { MahjongTableView } from '@/objects';
import { useEffect, useRef } from 'react';

interface UsePendingMahjongTableSyncParams {
  isLocalSettlementDisplayActive: boolean;
  latestMahjongTable: MahjongTableView;
  setDisplayedMahjongTable: (mahjongTable: MahjongTableView) => void;
}

export function usePendingMahjongTableSync({
  isLocalSettlementDisplayActive,
  latestMahjongTable,
  setDisplayedMahjongTable,
}: UsePendingMahjongTableSyncParams) {
  const pendingMahjongTableRef = useRef<MahjongTableView | null>(null);

  useEffect(() => {
    if (isLocalSettlementDisplayActive) {
      pendingMahjongTableRef.current = latestMahjongTable;
      return;
    }

    pendingMahjongTableRef.current = null;
    setDisplayedMahjongTable(latestMahjongTable);
  }, [
    isLocalSettlementDisplayActive,
    latestMahjongTable,
    setDisplayedMahjongTable,
  ]);

  useEffect(() => {
    if (isLocalSettlementDisplayActive || !pendingMahjongTableRef.current) {
      return;
    }

    const pendingTable = pendingMahjongTableRef.current;
    pendingMahjongTableRef.current = null;
    setDisplayedMahjongTable(pendingTable);
  }, [isLocalSettlementDisplayActive, setDisplayedMahjongTable]);
}
