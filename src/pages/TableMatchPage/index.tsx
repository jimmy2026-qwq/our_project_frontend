import { useEffect, useMemo, useReducer, useState } from 'react';
import { useParams } from 'react-router-dom';

import { ApiError } from '@/system/api/http';
import {
  AppealDialog,
  SeatsOverviewCard,
  TableMatchError,
  TableMatchHeader,
  TableMatchLoading,
} from './components/table-match';
import type { TableDetail } from '@/pages/objects/tournament';
import { useAuth } from '@/app/auth/useAuth';
import { useMutationNotice } from '@/app/feedback/useMutationNotice';
import { useNotice } from '@/app/feedback/useNotice';
import { fileAppeal, getTable, updateOwnReadyState } from './objects/data';

export function TableMatchPage() {
  const { tableId = '' } = useParams();
  const { session } = useAuth();
  const { notifyMutationResult } = useMutationNotice();
  const { notifyWarning, notifyInfo, notifySuccess } = useNotice();
  const [table, setTable] = useState<TableDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isUpdatingOwnReady, setIsUpdatingOwnReady] = useState(false);
  const [isAppealDialogOpen, setIsAppealDialogOpen] = useState(false);
  const [appealDescription, setAppealDescription] = useState('');
  const [isSubmittingAppeal, setIsSubmittingAppeal] = useState(false);
  const [appealError, setAppealError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, forceReload] = useReducer((value) => value + 1, 0);
  const backLink = table?.tournamentId
    ? `/public/tournaments/${table.tournamentId}`
    : '/public';
  const operatorId = session?.user.operatorId ?? session?.user.userId ?? '';

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
          const message =
            loadError instanceof ApiError
              ? loadError.message
              : loadError instanceof Error
                ? loadError.message
                : 'Failed to load table details.';
          setError(message);
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

  const seatMap = useMemo(() => {
    const entries = table?.seats ?? [];
    return {
      East: entries.find((seat) => seat.seat === 'East') ?? null,
      South: entries.find((seat) => seat.seat === 'South') ?? null,
      West: entries.find((seat) => seat.seat === 'West') ?? null,
      North: entries.find((seat) => seat.seat === 'North') ?? null,
    };
  }, [table]);

  const ownSeat = useMemo(
    () => table?.seats.find((seat) => seat.playerId === operatorId) ?? null,
    [operatorId, table],
  );

  const canUpdateOwnReady =
    !!session?.user.roles.isRegisteredPlayer &&
    !!operatorId &&
    !!ownSeat &&
    table?.status === 'WaitingPreparation' &&
    !ownSeat.disconnected;
  const canFileAppeal =
    !!session?.user.roles.isRegisteredPlayer &&
    !!operatorId &&
    !!ownSeat &&
    table?.status !== 'Archived' &&
    table?.status !== 'AppealPending' &&
    table?.status !== 'AppealInProgress';

  async function handleSubmitAppeal() {
    if (!table || !operatorId || !ownSeat) {
      notifyInfo(
        '暂时无法提交申诉',
        '请使用本桌参赛玩家账号进入牌桌后再提交申诉。',
      );
      return;
    }

    const trimmedDescription = appealDescription.trim();
    if (!trimmedDescription) {
      setAppealError('请先填写申诉说明。');
      return;
    }

    try {
      setIsSubmittingAppeal(true);
      setAppealError(null);
      await fileAppeal(table.id, {
        playerId: operatorId,
        description: trimmedDescription,
      });
      setAppealDescription('');
      setIsAppealDialogOpen(false);
      notifySuccess(
        '申诉已提交',
        `牌桌 ${String(table.tableNo).padStart(2, '0')} 的申诉工单已经创建。`,
      );
      forceReload();
    } catch (submitError) {
      const message =
        submitError instanceof ApiError
          ? submitError.message
          : submitError instanceof Error
            ? submitError.message
            : '提交申诉失败，请稍后重试。';
      setAppealError(message);

      if (!(submitError instanceof ApiError)) {
        notifyWarning('提交申诉失败', message);
      }
    } finally {
      setIsSubmittingAppeal(false);
    }
  }

  async function handleToggleOwnReady() {
    if (!table || !ownSeat || !operatorId) {
      notifyInfo(
        'Ready state unavailable',
        'Sign in as a seated player to update your own ready status.',
      );
      return;
    }

    try {
      setIsUpdatingOwnReady(true);
      setError(null);
      const nextTable = await updateOwnReadyState(table.id, {
        operatorId,
        ready: !ownSeat.ready,
      });
      setTable(nextTable);
      notifyMutationResult(
        { source: 'api' },
        {
          successTitle: ownSeat.ready ? 'Ready removed' : 'Ready confirmed',
          successMessage: ownSeat.ready
            ? `You are no longer marked ready at Table ${String(table.tableNo).padStart(2, '0')}.`
            : `You are marked ready at Table ${String(table.tableNo).padStart(2, '0')}.`,
          fallbackTitle: 'Ready state update unavailable',
          fallbackMessage: 'Your ready state could not be updated right now.',
        },
      );
    } catch (updateError) {
      const message =
        updateError instanceof ApiError
          ? updateError.message
          : updateError instanceof Error
            ? updateError.message
            : 'Failed to update your ready state.';
      setError(message);

      if (!(updateError instanceof ApiError)) {
        notifyWarning('Failed to update ready state', message);
      }
    } finally {
      setIsUpdatingOwnReady(false);
    }
  }

  if (isLoading) {
    return <TableMatchLoading />;
  }

  if (error || !table) {
    return (
      <TableMatchError
        error={error}
        backLink={backLink}
        onRetry={() => forceReload()}
      />
    );
  }

  return (
    <section className="grid gap-6">
      <TableMatchHeader
        table={table}
        backLink={backLink}
        isRefreshing={isRefreshing}
        canUpdateOwnReady={canUpdateOwnReady}
        isUpdatingOwnReady={isUpdatingOwnReady}
        ownSeat={ownSeat}
        onRefresh={() => forceReload()}
        onToggleOwnReady={() => void handleToggleOwnReady()}
      />

      <SeatsOverviewCard
        table={table}
        seatMap={seatMap}
        ownSeat={ownSeat}
        canFileAppeal={canFileAppeal}
        isRegisteredPlayer={!!session?.user.roles.isRegisteredPlayer}
        operatorId={operatorId}
        onOpenAppeal={() => {
          setAppealError(null);
          setIsAppealDialogOpen(true);
        }}
      />

      <AppealDialog
        open={isAppealDialogOpen}
        onOpenChange={(open) => {
          setIsAppealDialogOpen(open);
          if (!open) {
            setAppealError(null);
          }
        }}
        appealDescription={appealDescription}
        appealError={appealError}
        operatorId={operatorId}
        canFileAppeal={canFileAppeal}
        isSubmittingAppeal={isSubmittingAppeal}
        onDescriptionChange={setAppealDescription}
        onSubmit={() => void handleSubmitAppeal()}
      />
    </section>
  );
}
