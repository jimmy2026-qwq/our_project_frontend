import { useEffect, useState } from 'react';

import { TournamentTableGetAPI } from '@/api/tournament';
import type { TableDetail } from '@/pages/objects/tournament';
import { mapTableDetail } from '@/pages/objects/tournament';
import { sendAPI } from '@/system/api';

import type { TournamentDetailTableItem } from '../../../../../objects/TournamentDetail.types';

export function useTournamentManagedTableDetail() {
  const [selectedManageTable, setSelectedManageTable] =
    useState<TournamentDetailTableItem | null>(null);
  const [tableDetail, setTableDetail] = useState<TableDetail | null>(null);
  const [tableDetailError, setTableDetailError] = useState('');
  const [isLoadingTableDetail, setIsLoadingTableDetail] = useState(false);

  useEffect(() => {
    if (!selectedManageTable) {
      setTableDetail(null);
      setTableDetailError('');
      return;
    }

    let cancelled = false;
    setIsLoadingTableDetail(true);

    void sendAPI(new TournamentTableGetAPI(selectedManageTable.id))
      .then(mapTableDetail)
      .then((detail) => {
        if (!cancelled) {
          setTableDetail(detail);
          setTableDetailError('');
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setTableDetail(null);
          setTableDetailError(
            error instanceof Error ? error.message : '无法加载牌桌详情。',
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoadingTableDetail(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selectedManageTable]);

  return {
    isLoadingTableDetail,
    selectedManageTable,
    tableDetail,
    tableDetailError,
    setSelectedManageTable,
    setTableDetail,
    setTableDetailError,
  };
}
