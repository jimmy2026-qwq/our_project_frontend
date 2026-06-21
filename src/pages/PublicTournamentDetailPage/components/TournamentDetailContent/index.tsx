import { Alert } from '@/components/ui';
import type { AppealDecisionType } from '@/objects';
import type { AppealSummary } from '@/pages/shared_objects/tournament/AppealSummary';
import type { TableDetail } from '@/pages/shared_objects/tournament/TableDetail';

import { TournamentDetailAppealsTab } from './components/TournamentDetailAppealsTab';
import { TournamentDetailHomeTab } from './components/TournamentDetailHomeTab';
import { TournamentDetailParticipantsTab } from './components/TournamentDetailParticipantsTab';
import { TournamentDetailRulesTab } from './components/TournamentDetailRulesTab';
import { AppealDialog } from '@/pages/TableMatchPage/components/TableMatchSection/AppealDialog';
import { TournamentDetailManageTab } from './components/TournamentDetailTableTabs/TournamentDetailManageTab';
import { TournamentDetailTablesTab } from './components/TournamentDetailTableTabs/TournamentDetailTablesTab';
import {
  TournamentDetailSidebar,
  type TournamentDetailContentTabItem,
} from './TournamentDetailSidebar';
import { detailShellClassNames } from '../detailShell.styles';
import type {
  TournamentDetailTableItem,
  TournamentDetailWorkbenchState,
} from '../../objects/TournamentDetail.types';
import type { TournamentDetailTab } from '../../objects/TournamentDetailView.types';

/** 赛事详情页主体内容，管理标签页切换和各业务面板组合。 */
export function TournamentDetailContent({
  activeTab,
  appeals,
  appealsError,
  canManageAppeals,
  isSubmittingTableAction,
  isSubmittingTableAppeal,
  operatorId,
  participantWaitingTableDetails,
  selectedAppealTable,
  tableAppealDescription,
  tableAppealError,
  submittingAppealId,
  tableDetailError,
  tabItems,
  updatingReadyTableId,
  uploadingDemoPaifuTableId,
  finalizingArchiveTableId,
  waitingTables,
  workbench,
  onActiveTabChange,
  onAssignAppeal,
  onInviteClub,
  onInvitePlayer,
  onOpenRulesDialog,
  onOpenAppealAction,
  onOpenTableAppeal,
  onSelectClubId,
  onSelectPlayerId,
  onSelectManageTable,
  onStartManagedTable,
  onToggleOwnReady,
  onTableAppealOpenChange,
  onTableAppealDescriptionChange,
  onSubmitTableAppeal,
  onFinalizeArchive,
  onUploadDemoPaifu,
  onToggleShowMore,
}: {
  activeTab: TournamentDetailTab;
  appeals: AppealSummary[];
  appealsError: string;
  canManageAppeals: boolean;
  isSubmittingTableAction: boolean;
  isSubmittingTableAppeal: boolean;
  operatorId: string;
  participantWaitingTableDetails: Record<string, TableDetail>;
  selectedAppealTable: TournamentDetailTableItem | null;
  tableAppealDescription: string;
  tableAppealError: string | null;
  submittingAppealId: string;
  tableDetailError: string;
  tabItems: TournamentDetailContentTabItem[];
  updatingReadyTableId: string | null;
  uploadingDemoPaifuTableId: string | null;
  finalizingArchiveTableId: string | null;
  waitingTables: TournamentDetailTableItem[];
  workbench: TournamentDetailWorkbenchState;
  onActiveTabChange: (tab: TournamentDetailTab) => void;
  onAssignAppeal: (appeal: AppealSummary) => void;
  onInviteClub: () => Promise<void> | void;
  onInvitePlayer: () => Promise<void> | void;
  onOpenRulesDialog: () => void;
  onOpenAppealAction: (
    appeal: AppealSummary,
    decision: AppealDecisionType,
  ) => void;
  onOpenTableAppeal: (table: TournamentDetailTableItem) => void;
  onSelectClubId: (clubId: string | null) => void;
  onSelectPlayerId: (playerId: string | null) => void;
  onSelectManageTable: (table: TournamentDetailTableItem) => void;
  onStartManagedTable: (table: TournamentDetailTableItem) => void;
  onToggleOwnReady: (tableId: string, isReady: boolean) => void;
  onTableAppealOpenChange: (open: boolean) => void;
  onTableAppealDescriptionChange: (description: string) => void;
  onSubmitTableAppeal: () => void;
  onFinalizeArchive: (table: TournamentDetailTableItem) => void;
  onUploadDemoPaifu: (table: TournamentDetailTableItem) => void;
  onToggleShowMore: () => void;
}) {
  return (
    <div className={detailShellClassNames.frame}>
      <TournamentDetailSidebar
        activeTab={activeTab}
        tabItems={tabItems}
        onActiveTabChange={onActiveTabChange}
      />

      <div className={detailShellClassNames.content}>
        {workbench.tournamentActionError ? (
          <Alert variant="danger">{workbench.tournamentActionError}</Alert>
        ) : null}

        {activeTab === 'home' ? (
          <TournamentDetailHomeTab
            workbench={workbench}
            onToggleShowMore={onToggleShowMore}
          />
        ) : null}

        {activeTab === 'rules' ? (
          <TournamentDetailRulesTab
            workbench={workbench}
            onOpenRulesDialog={onOpenRulesDialog}
          />
        ) : null}

        {activeTab === 'participants' ? (
          <TournamentDetailParticipantsTab
            workbench={workbench}
            onInviteClub={onInviteClub}
            onInvitePlayer={onInvitePlayer}
            onSelectClubId={onSelectClubId}
            onSelectPlayerId={onSelectPlayerId}
          />
        ) : null}

        {activeTab === 'tables' ? (
          <TournamentDetailTablesTab
            operatorId={operatorId}
            participantWaitingTableDetails={participantWaitingTableDetails}
            tableDetailError={tableDetailError}
            updatingReadyTableId={updatingReadyTableId}
            uploadingDemoPaifuTableId={uploadingDemoPaifuTableId}
            finalizingArchiveTableId={finalizingArchiveTableId}
            workbench={workbench}
            onToggleOwnReady={onToggleOwnReady}
            onUploadDemoPaifu={onUploadDemoPaifu}
            onOpenTableAppeal={onOpenTableAppeal}
            onFinalizeArchive={onFinalizeArchive}
          />
        ) : null}

        {activeTab === 'manage' ? (
          <TournamentDetailManageTab
            isSubmittingTableAction={isSubmittingTableAction}
            waitingTables={waitingTables}
            workbench={workbench}
            onSelectManageTable={onSelectManageTable}
            onStartManagedTable={onStartManagedTable}
          />
        ) : null}

        {activeTab === 'appeals' ? (
          <TournamentDetailAppealsTab
            appeals={appeals}
            appealsError={appealsError}
            canManageAppeals={canManageAppeals}
            submittingAppealId={submittingAppealId}
            workbench={workbench}
            onAssignAppeal={onAssignAppeal}
            onOpenAppealAction={onOpenAppealAction}
          />
        ) : null}

        <AppealDialog
          open={!!selectedAppealTable}
          onOpenChange={onTableAppealOpenChange}
          appealDescription={tableAppealDescription}
          appealError={tableAppealError}
          operatorId={operatorId}
          canFileAppeal={!!selectedAppealTable}
          isSubmittingAppeal={isSubmittingTableAppeal}
          onDescriptionChange={onTableAppealDescriptionChange}
          onSubmit={onSubmitTableAppeal}
        />
      </div>
    </div>
  );
}
