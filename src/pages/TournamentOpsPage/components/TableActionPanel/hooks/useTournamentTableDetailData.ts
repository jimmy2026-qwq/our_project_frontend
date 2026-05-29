import { useEffect, type Dispatch, type SetStateAction } from 'react';

import { TournamentTableGetAPI } from '@/api/tournament/TournamentTableGetAPI';
import type { TableDetail } from '@/pages/objects/TournamentViews';
import { sendAPI } from '@/system/api';

import { toTableDetail } from '../../../objects/TournamentOps.mappers';

export function useTournamentTableDetailData(
  reloadKey: number,
  selectedTableId: string,
  setTableDetail: Dispatch<SetStateAction<TableDetail | null>>,
) {
  useEffect(() => {
    let cancelled = false;

    if (!selectedTableId) {
      setTableDetail(null);
      return () => {
        cancelled = true;
      };
    }

    async function loadTableDetail() {
      try {
        const table = await sendAPI(new TournamentTableGetAPI(selectedTableId));
        const detail = toTableDetail(table);

        if (!cancelled) {
          setTableDetail(detail);
        }
      } catch {
        if (!cancelled) {
          setTableDetail(null);
        }
      }
    }

    void loadTableDetail();

    return () => {
      cancelled = true;
    };
  }, [reloadKey, selectedTableId, setTableDetail]);
}
