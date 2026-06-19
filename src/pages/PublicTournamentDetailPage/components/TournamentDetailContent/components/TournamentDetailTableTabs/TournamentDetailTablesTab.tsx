import { useState } from 'react';

import {
  Alert,
  EmptyState,
} from '@/components/ui';
import { cx } from '@/components/ui/cx';
import { PaifuSummaryDialog } from '@/components/mahjong-result/PaifuSummaryDialog';
import type { MatchRecordSummary } from '@/pages/shared_objects/tournament/MatchRecordSummary';
import type { TableDetail } from '@/pages/shared_objects/tournament/TableDetail';

import { detailShellClassNames } from '../../../detailShell.styles';
import type {
  TournamentDetailTableItem,
  TournamentDetailWorkbenchState,
} from '../../../../objects/TournamentDetail.types';
import { TournamentDetailTableRow } from './TournamentDetailTableRow';

export function TournamentDetailTablesTab({
  operatorId,
  participantWaitingTableDetails,
  tableDetailError,
  updatingReadyTableId,
  uploadingDemoPaifuTableId,
  finalizingArchiveTableId,
  workbench,
  onToggleOwnReady,
  onUploadDemoPaifu,
  onOpenTableAppeal,
  onFinalizeArchive,
}: {
  operatorId: string;
  participantWaitingTableDetails: Record<string, TableDetail>;
  tableDetailError: string;
  updatingReadyTableId: string;
  uploadingDemoPaifuTableId: string;
  finalizingArchiveTableId: string;
  workbench: TournamentDetailWorkbenchState;
  onToggleOwnReady: (tableId: string, isReady: boolean) => void;
  onUploadDemoPaifu: (table: TournamentDetailTableItem) => void;
  onOpenTableAppeal: (table: TournamentDetailTableItem) => void;
  onFinalizeArchive: (table: TournamentDetailTableItem) => void;
}) {
  const [summaryRecord, setSummaryRecord] =
    useState<MatchRecordSummary | null>(null);

  return (
    <>
      <div
        className={cx(
          detailShellClassNames.panel,
          detailShellClassNames.panelFull,
        )}
      >
        <section className={detailShellClassNames.list}>
          <div className={detailShellClassNames.listBody}>
            {tableDetailError ? (
              <Alert variant="danger">{tableDetailError}</Alert>
            ) : null}
            {workbench.visibleTables.length > 0 ? (
              workbench.visibleTables.map((table) => (
                <TournamentDetailTableRow
                  key={table.id}
                  finalizingArchiveTableId={finalizingArchiveTableId}
                  operatorId={operatorId}
                  participantWaitingTableDetails={
                    participantWaitingTableDetails
                  }
                  table={table}
                  updatingReadyTableId={updatingReadyTableId}
                  uploadingDemoPaifuTableId={uploadingDemoPaifuTableId}
                  workbench={workbench}
                  onFinalizeArchive={onFinalizeArchive}
                  onOpenRecordSummary={setSummaryRecord}
                  onOpenTableAppeal={onOpenTableAppeal}
                  onToggleOwnReady={onToggleOwnReady}
                  onUploadDemoPaifu={onUploadDemoPaifu}
                />
              ))
            ) : (
              <EmptyState asListItem={false}>
                当前还没有可展示的赛事牌桌。
              </EmptyState>
            )}
          </div>
        </section>
      </div>
      <PaifuSummaryDialog
        open={!!summaryRecord}
        playerNames={workbench.playerNames}
        record={summaryRecord}
        onOpenChange={(open) => {
          if (!open) {
            setSummaryRecord(null);
          }
        }}
      />
    </>
  );
}
