import { useState } from 'react';

import {
  AppealFileAPI,
  TournamentTableFinalizeArchiveAPI,
  TournamentTableGetAPI,
  TournamentTableStartAPI,
  TournamentTableUploadPaifuAPI,
} from '@/api/tournament';
import type { TableDetail } from '@/pages/objects/TournamentViews';
import { createDemoTablePaifuForTable } from '@/pages/TablePaifuPage/demo';
import { toBackendPaifu } from '@/pages/TablePaifuPage/objects/TablePaifuData.mappers';
import { sendAPI } from '@/system/api';

import type { TournamentDetailTableItem } from '../../../../../objects/TournamentDetail.types';
import { toTableDetail } from '../../../../../objects/TournamentDetailTable.mappers';

export function useTournamentTableActionsRuntime({
  operatorId,
  onScheduleSuccess,
  playerNameMap,
  selectedManageTable,
  setSelectedManageTable,
  setTableDetail,
  setTableDetailError,
}: {
  operatorId: string;
  onScheduleSuccess?: () => void;
  playerNameMap: Record<string, string>;
  selectedManageTable: TournamentDetailTableItem | null;
  setSelectedManageTable: (table: TournamentDetailTableItem | null) => void;
  setTableDetail: (detail: TableDetail | null) => void;
  setTableDetailError: (message: string) => void;
}) {
  const [isSubmittingTableAction, setIsSubmittingTableAction] = useState(false);
  const [uploadingDemoPaifuTableId, setUploadingDemoPaifuTableId] =
    useState('');
  const [finalizingArchiveTableId, setFinalizingArchiveTableId] = useState('');
  const [selectedAppealTable, setSelectedAppealTable] =
    useState<TournamentDetailTableItem | null>(null);
  const [appealDescription, setAppealDescription] = useState('');
  const [appealError, setAppealError] = useState<string | null>(null);
  const [isSubmittingAppeal, setIsSubmittingAppeal] = useState(false);
  const [pendingStartConfirmation, setPendingStartConfirmation] = useState<{
    tableId: string;
    tableCode: string;
    unreadyPlayerNames: string[];
  } | null>(null);

  async function actuallyStartManagedTable(tableId: string) {
    if (!operatorId) {
      return;
    }

    try {
      setIsSubmittingTableAction(true);
      setTableDetailError('');
      await sendAPI(new TournamentTableStartAPI(tableId, operatorId));
      onScheduleSuccess?.();
      if (selectedManageTable?.id === tableId) {
        setSelectedManageTable(null);
      }
    } catch (error) {
      setTableDetailError(
        error instanceof Error ? error.message : '无法开启牌桌。',
      );
    } finally {
      setIsSubmittingTableAction(false);
    }
  }

  async function handleStartManagedTable(
    table: Pick<TournamentDetailTableItem, 'id' | 'tableCode'>,
    knownDetail?: TableDetail | null,
  ) {
    if (!operatorId) {
      return;
    }

    try {
      setIsSubmittingTableAction(true);
      setTableDetailError('');
      const detail: TableDetail =
        knownDetail ??
        (await sendAPI(new TournamentTableGetAPI(table.id)).then(
          toTableDetail,
        ));
      const unreadyPlayerNames = detail.seats
        .filter((seat) => !seat.ready)
        .map((seat) => playerNameMap[seat.playerId] ?? seat.playerId);

      if (unreadyPlayerNames.length > 0) {
        setPendingStartConfirmation({
          tableId: table.id,
          tableCode: table.tableCode,
          unreadyPlayerNames,
        });
        if (selectedManageTable?.id === table.id) {
          setTableDetail(detail);
        }
        return;
      }

      await actuallyStartManagedTable(table.id);
    } catch (error) {
      setTableDetailError(
        error instanceof Error ? error.message : '无法检查牌桌准备情况。',
      );
    } finally {
      setIsSubmittingTableAction(false);
    }
  }

  async function handleForceStartManagedTable() {
    if (!pendingStartConfirmation) {
      return;
    }

    await actuallyStartManagedTable(pendingStartConfirmation.tableId);
    setPendingStartConfirmation(null);
  }

  async function handleUploadDemoPaifu(
    table: Pick<TournamentDetailTableItem, 'id'>,
  ) {
    if (!operatorId) {
      return;
    }

    try {
      setUploadingDemoPaifuTableId(table.id);
      setTableDetailError('');
      const detail = await sendAPI(new TournamentTableGetAPI(table.id)).then(
        toTableDetail,
      );
      const paifu = createDemoTablePaifuForTable(detail);
      await sendAPI(
        new TournamentTableUploadPaifuAPI(table.id, {
          operatorId,
          paifu: toBackendPaifu(paifu),
        }),
      ).then(toTableDetail);
      onScheduleSuccess?.();
    } catch (error) {
      setTableDetailError(
        error instanceof Error ? error.message : '无法上传默认牌谱结束牌桌。',
      );
    } finally {
      setUploadingDemoPaifuTableId('');
    }
  }

  function openTableAppealDialog(table: TournamentDetailTableItem) {
    setSelectedAppealTable(table);
    setAppealDescription('');
    setAppealError(null);
  }

  function setTableAppealDialogOpen(open: boolean) {
    if (!open) {
      setSelectedAppealTable(null);
      setAppealError(null);
    }
  }

  async function handleSubmitTableAppeal() {
    if (!operatorId || !selectedAppealTable) {
      return;
    }

    const description = appealDescription.trim();
    if (!description) {
      setAppealError('请先填写申诉说明。');
      return;
    }

    try {
      setIsSubmittingAppeal(true);
      setAppealError(null);
      setTableDetailError('');
      await sendAPI(
        new AppealFileAPI(selectedAppealTable.id, {
          playerId: operatorId,
          description,
        }),
      );
      setSelectedAppealTable(null);
      setAppealDescription('');
      onScheduleSuccess?.();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : '无法提交赛事申诉。';
      setAppealError(message);
      setTableDetailError(message);
    } finally {
      setIsSubmittingAppeal(false);
    }
  }

  async function handleFinalizeArchive(table: Pick<TournamentDetailTableItem, 'id'>) {
    if (!operatorId) {
      return;
    }

    try {
      setFinalizingArchiveTableId(table.id);
      setTableDetailError('');
      await sendAPI(new TournamentTableFinalizeArchiveAPI(table.id, operatorId));
      onScheduleSuccess?.();
    } catch (error) {
      setTableDetailError(
        error instanceof Error ? error.message : '无法确认归档牌桌。',
      );
    } finally {
      setFinalizingArchiveTableId('');
    }
  }

  return {
    appealDescription,
    appealError,
    finalizingArchiveTableId,
    isSubmittingTableAction,
    isSubmittingAppeal,
    pendingStartConfirmation,
    selectedAppealTable,
    uploadingDemoPaifuTableId,
    handleFinalizeArchive,
    handleForceStartManagedTable,
    handleStartManagedTable,
    handleSubmitTableAppeal,
    handleUploadDemoPaifu,
    openTableAppealDialog,
    setAppealDescription,
    setTableAppealDialogOpen,
    setPendingStartConfirmation,
  };
}
