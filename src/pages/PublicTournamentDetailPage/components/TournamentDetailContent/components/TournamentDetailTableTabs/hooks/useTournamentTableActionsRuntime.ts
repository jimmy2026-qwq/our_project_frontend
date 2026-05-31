import { useState } from 'react';

import {
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

  return {
    isSubmittingTableAction,
    pendingStartConfirmation,
    uploadingDemoPaifuTableId,
    handleForceStartManagedTable,
    handleStartManagedTable,
    handleUploadDemoPaifu,
    setPendingStartConfirmation,
  };
}
