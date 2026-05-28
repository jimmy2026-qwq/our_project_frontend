import { Alert } from '@/components/ui';
import { cx } from '@/components/ui/cx';
import type { AppealSummary, TableDetail } from '@/pages/objects/tournament';

import { TournamentDetailAppealsTab } from './components/TournamentDetailAppealsTab';
import { TournamentDetailHomeTab } from './components/TournamentDetailHomeTab';
import { TournamentDetailParticipantsTab } from './components/TournamentDetailParticipantsTab';
import { TournamentDetailRulesTab } from './components/TournamentDetailRulesTab';
import {
  TournamentDetailManageTab,
  TournamentDetailTablesTab,
} from './components/TournamentDetailTableTabs';
import { detailShellClassNames } from '../detailShell.styles';
import type {
  TournamentDetailTableItem,
  TournamentDetailWorkbenchState,
} from '../../objects/TournamentDetail.types';
import type {
  AppealDecisionType,
  TournamentDetailTab,
} from '../../objects/TournamentDetail.view';

type TabItem = { id: TournamentDetailTab; label: string };

export function TournamentDetailContent({
  activeTab,
  appeals,
  appealsError,
  canManageAppeals,
  isSubmittingTableAction,
  operatorId,
  participantWaitingTableDetails,
  submittingAppealId,
  tableDetailError,
  tabItems,
  updatingReadyTableId,
  uploadingDemoPaifuTableId,
  waitingTables,
  workbench,
  onActiveTabChange,
  onAssignAppeal,
  onInviteClub,
  onInvitePlayer,
  onOpenRulesDialog,
  onOpenAppealAction,
  onSelectClubId,
  onSelectPlayerId,
  onSelectManageTable,
  onStartManagedTable,
  onToggleOwnReady,
  onUploadDemoPaifu,
  onToggleShowMore,
}: {
  activeTab: TournamentDetailTab;
  appeals: AppealSummary[];
  appealsError: string;
  canManageAppeals: boolean;
  isSubmittingTableAction: boolean;
  operatorId: string;
  participantWaitingTableDetails: Record<string, TableDetail>;
  submittingAppealId: string;
  tableDetailError: string;
  tabItems: TabItem[];
  updatingReadyTableId: string;
  uploadingDemoPaifuTableId: string;
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
  onSelectClubId: (clubId: string) => void;
  onSelectPlayerId: (playerId: string) => void;
  onSelectManageTable: (table: TournamentDetailTableItem) => void;
  onStartManagedTable: (table: TournamentDetailTableItem) => void;
  onToggleOwnReady: (tableId: string, isReady: boolean) => void;
  onUploadDemoPaifu: (table: TournamentDetailTableItem) => void;
  onToggleShowMore: () => void;
}) {
  return (
    <div className={detailShellClassNames.frame}>
      <aside className={detailShellClassNames.sidebar}>
        {tabItems.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={cx(
              detailShellClassNames.navItem,
              activeTab === tab.id ? detailShellClassNames.navItemActive : '',
            )}
            onClick={() => onActiveTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </aside>

      <div
        className={cx(
          detailShellClassNames.content,
        )}
      >
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
            workbench={workbench}
            onToggleOwnReady={onToggleOwnReady}
            onUploadDemoPaifu={onUploadDemoPaifu}
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
      </div>
    </div>
  );
}
