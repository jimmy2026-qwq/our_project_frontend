import {
  PublicTournamentDetailFrame,
  PublicTournamentDetailLoading,
  PublicTournamentDetailNotFound,
} from './components/PublicTournamentDetailFrame';
import { detailShellClassNames } from './components/detailShell.styles';
import { TournamentDetailContent } from './components/TournamentDetailContent';
import { AppealDecisionDialog } from './components/TournamentDetailDialogs/AppealDecisionDialog';
import { ManagedTableDetailDialog } from './components/TournamentDetailDialogs/ManagedTableDetailDialog';
import { PendingStartConfirmationDialog } from './components/TournamentDetailDialogs/PendingStartConfirmationDialog';
import { PublishBlockedDialog } from './components/TournamentDetailDialogs/PublishBlockedDialog';
import { TournamentDetailHeader } from './components/TournamentDetailHeader';
import { TournamentRulesDialog } from './components/TournamentDetailDialogs/TournamentRulesDialog';
import { usePublicTournamentDetailPage } from './hooks/usePublicTournamentDetailPage';

export function PublicTournamentDetailPage() {
  const page = usePublicTournamentDetailPage();

  if (page.isLoading) {
    return (
      <PublicTournamentDetailFrame>
        <PublicTournamentDetailLoading />
      </PublicTournamentDetailFrame>
    );
  }

  if (page.isNotFound || !page.workbench || !page.dialogs.ruleDraft) {
    return (
      <PublicTournamentDetailFrame>
        <PublicTournamentDetailNotFound title="未找到赛事" />
      </PublicTournamentDetailFrame>
    );
  }

  return (
    <PublicTournamentDetailFrame>
      <section className={detailShellClassNames.shell}>
        <TournamentDetailHeader
          workbench={page.workbench}
          onBack={page.shell.onBack}
          onPublishTournament={page.header.onPublishTournament}
          onRunHeaderStageAction={page.header.onRunHeaderStageAction}
        />

        <TournamentDetailContent
          activeTab={page.content.activeTab}
          appeals={page.content.appeals}
          appealsError={page.content.appealsError}
          canManageAppeals={page.content.canManageAppeals}
          isSubmittingTableAction={page.content.isSubmittingTableAction}
          isSubmittingTableAppeal={page.content.isSubmittingTableAppeal}
          operatorId={page.content.operatorId}
          participantWaitingTableDetails={
            page.content.participantWaitingTableDetails
          }
          selectedAppealTable={page.content.selectedAppealTable}
          tableAppealDescription={page.content.tableAppealDescription}
          tableAppealError={page.content.tableAppealError}
          submittingAppealId={page.content.submittingAppealId}
          tableDetailError={page.content.tableDetailError}
          tabItems={page.content.tabItems}
          updatingReadyTableId={page.content.updatingReadyTableId}
          uploadingDemoPaifuTableId={page.content.uploadingDemoPaifuTableId}
          finalizingArchiveTableId={page.content.finalizingArchiveTableId}
          waitingTables={page.content.waitingTables}
          workbench={page.workbench}
          onActiveTabChange={page.content.onActiveTabChange}
          onAssignAppeal={(appeal) => void page.content.onAssignAppeal(appeal)}
          onInviteClub={page.content.onInviteClub}
          onInvitePlayer={page.content.onInvitePlayer}
          onOpenRulesDialog={page.content.onOpenRulesDialog}
          onOpenAppealAction={page.content.onOpenAppealAction}
          onOpenTableAppeal={page.content.onOpenTableAppeal}
          onSelectClubId={page.content.onSelectClubId}
          onSelectPlayerId={page.content.onSelectPlayerId}
          onSelectManageTable={page.content.onSelectManageTable}
          onStartManagedTable={(table) =>
            void page.content.onStartManagedTable(table)
          }
          onToggleOwnReady={(tableId, isReady) =>
            void page.content.onToggleOwnReady(tableId, isReady)
          }
          onTableAppealOpenChange={page.content.onTableAppealOpenChange}
          onTableAppealDescriptionChange={
            page.content.onTableAppealDescriptionChange
          }
          onSubmitTableAppeal={() => void page.content.onSubmitTableAppeal()}
          onFinalizeArchive={(table) =>
            void page.content.onFinalizeArchive(table)
          }
          onUploadDemoPaifu={(table) =>
            void page.content.onUploadDemoPaifu(table)
          }
          onToggleShowMore={page.content.onToggleShowMore}
        />
      </section>

      <PublishBlockedDialog
        open={page.dialogs.publishBlockedOpen}
        onOpenChange={page.dialogs.onPublishBlockedOpenChange}
      />

      <TournamentRulesDialog
        open={page.dialogs.rulesDialogOpen}
        draft={page.dialogs.ruleDraft}
        isSubmitting={page.dialogs.isSubmittingTournamentAction}
        hasStage={page.dialogs.hasStage}
        onOpenChange={page.dialogs.onRulesDialogOpenChange}
        onDraftChange={page.dialogs.onRuleDraftChange}
        onSubmit={page.dialogs.onSaveRules}
      />

      <ManagedTableDetailDialog
        selectedManageTable={page.dialogs.selectedManageTable}
        tableDetail={page.dialogs.tableDetail}
        tableDetailError={page.dialogs.tableDetailError}
        isLoadingTableDetail={page.dialogs.isLoadingTableDetail}
        isSubmittingTableAction={page.dialogs.isSubmittingTableAction}
        playerNames={page.dialogs.playerNames}
        onClose={page.dialogs.onCloseManageTable}
        onStartTable={(table, detail) =>
          void page.dialogs.onStartManagedTable(table, detail)
        }
      />

      <PendingStartConfirmationDialog
        pendingStartConfirmation={page.dialogs.pendingStartConfirmation}
        isSubmittingTableAction={page.dialogs.isSubmittingTableAction}
        onClose={page.dialogs.onClosePendingStartConfirmation}
        onForceStart={() => void page.dialogs.onForceStartManagedTable()}
      />

      <AppealDecisionDialog
        selectedAppealAction={page.dialogs.selectedAppealAction}
        appealVerdict={page.dialogs.appealVerdict}
        appealActionError={page.dialogs.appealActionError}
        shouldResetTableOnResolve={page.dialogs.shouldResetTableOnResolve}
        submittingAppealId={page.dialogs.submittingAppealId}
        onClose={page.dialogs.onCloseAppealDecisionDialog}
        onVerdictChange={page.dialogs.onAppealVerdictChange}
        onShouldResetTableOnResolveChange={
          page.dialogs.onShouldResetTableOnResolveChange
        }
        onSubmit={() => void page.dialogs.onSubmitAppealDecision()}
      />
    </PublicTournamentDetailFrame>
  );
}
