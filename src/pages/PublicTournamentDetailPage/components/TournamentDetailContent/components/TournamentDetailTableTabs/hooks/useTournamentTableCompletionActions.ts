import { useState } from 'react';

import {
  TournamentTableFinalizeArchiveAPI,
  TournamentTableGetAPI,
  TournamentTableUploadPaifuAPI,
} from '@/api/tournament';
import { createDemoTablePaifuForTable } from '@/pages/TablePaifuPage/demo';
import { toBackendPaifu } from '@/pages/TablePaifuPage/functions/TablePaifuData.mappers';
import { sendAPI } from '@/system/api';

import type { TournamentDetailTableItem } from '../../../../../objects/TournamentDetail.types';
import { toTableDetail } from '../../../../../functions/TournamentDetailTable.mappers';

export function useTournamentTableCompletionActions({
  operatorId,
  onScheduleSuccess,
  setTableDetailError,
}: {
  operatorId: string;
  onScheduleSuccess?: () => void;
  setTableDetailError: (message: string) => void;
}) {
  const [uploadingDemoPaifuTableId, setUploadingDemoPaifuTableId] =
    useState('');
  const [finalizingArchiveTableId, setFinalizingArchiveTableId] = useState('');

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

  async function handleFinalizeArchive(
    table: Pick<TournamentDetailTableItem, 'id'>,
  ) {
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
    finalizingArchiveTableId,
    uploadingDemoPaifuTableId,
    handleFinalizeArchive,
    handleUploadDemoPaifu,
  };
}
