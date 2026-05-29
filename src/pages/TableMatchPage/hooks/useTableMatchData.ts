import { useEffect, useReducer, useState } from 'react';

import { TournamentTableGetAPI } from '@/api/tournament';
import type { TournamentTableView } from '@/objects';
import type { TableDetail } from '@/pages/objects/TournamentViews';
import { sendAPI } from '@/system/api';
import { ApiError } from '@/system/api/http';

import { toTableDetail } from '../functions/toTableDetail';

export function useTableMatchData(tableId: string) {
  const [table, setTable] = useState<TableDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, forceReload] = useReducer((value) => value + 1, 0);

  useEffect(() => {
    let cancelled = false;

    async function loadTable() {
      const isInitialLoad = table === null;

      try {
        if (isInitialLoad) {
          setIsLoading(true);
        } else {
          setIsRefreshing(true);
        }

        setError(null);
        const payload = await getTable(tableId);

        if (!cancelled) {
          setTable(payload);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(getTableErrorMessage(loadError));
          setTable(null);
        }
      } finally {
        if (!cancelled) {
          if (isInitialLoad) {
            setIsLoading(false);
          }
          setIsRefreshing(false);
        }
      }
    }

    if (tableId) {
      void loadTable();
    } else {
      setError('Missing table id.');
      setIsLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [reloadKey, tableId]);

  useEffect(() => {
    if (table?.status !== 'InProgress') {
      return;
    }

    const timer = window.setInterval(() => {
      forceReload();
    }, 8000);

    return () => {
      window.clearInterval(timer);
    };
  }, [table?.status]);

  return {
    table,
    setTable,
    isLoading,
    isRefreshing,
    error,
    setError,
    forceReload,
  };
}

function getTable(tableId: string) {
  return sendAPI<TournamentTableView>(new TournamentTableGetAPI(tableId)).then(
    toTableDetail,
  );
}

function getTableErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Failed to load table details.';
}
