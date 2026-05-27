import { useEffect, type Dispatch, type SetStateAction } from 'react';

import { TournamentTableGetAPI } from '@/api/tournament/TournamentTableGetAPI';
import {
  mapTableDetail,
  type TableDetail,
} from '@/pages/objects/tournament';
import { sendAPI } from '@/system/api';

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
        const detail = mapTableDetail(table);

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
