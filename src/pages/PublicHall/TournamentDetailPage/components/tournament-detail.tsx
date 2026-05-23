import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/app/auth/useAuth';
import { Button } from '@/components/ui';
import { PublicDetailNotFound } from '@/pages/PublicHall/components/shared';
import type { TournamentPublicProfile } from '@/pages/PublicHall/objects';
import type { DetailState } from '@/pages/PublicHall/objects/types';

import { TournamentDetailContent } from './tournament-detail.content';
import {
  AppealDecisionDialog,
  ManagedTableDetailDialog,
  PendingStartConfirmationDialog,
} from './tournament-detail.dialogs';
import { PublishBlockedDialog } from './tournament-detail.panels';
import { TournamentRulesDialog } from './tournament-detail.rules-dialog';
import { detailShellClassNames } from './tournament-detail.styles';
import { useTournamentDetailRuntime } from '../hooks/tournament-detail.runtime';
import { useTournamentDetailWorkbench } from '../hooks/tournament-detail.hooks';

export const PublicTournamentDetailSection = ({
  state,
  onScheduleSuccess,
}: {
  state: DetailState<TournamentPublicProfile>;
  onScheduleSuccess?: () => void;
}) => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const {
    workbench,
    setSelectedClubId,
    setSelectedPlayerId,
    setPublishBlockedOpen,
    setRulesDialogOpen,
    setRuleDraft,
    setShowMoreInfo,
    handleInviteClub,
    handleInvitePlayer,
    handlePublishTournament,
    handleScheduleStage,
    handleCompleteStage,
    handleSettleTournament,
    handleSaveRules,
    openRulesDialog,
  } = useTournamentDetailWorkbench({
    state,
    session,
    navigate,
    onScheduleSuccess,
  });
  const operatorId = session?.user.operatorId ?? session?.user.userId ?? '';
  const runtime = useTournamentDetailRuntime({
    operatorId,
    workbench,
    onScheduleSuccess,
  });

  if (!state.item || !workbench) {
    return <PublicDetailNotFound title="Tournament not found" />;
  }

  return (
    <>
      <section className={detailShellClassNames.shell}>
        <header className={detailShellClassNames.header}>
          <button
            type="button"
            className={detailShellClassNames.back}
            onClick={() => navigate('/public')}
          >
            返回大厅
          </button>
          <div className={detailShellClassNames.title}>{`赛事：${workbench.profile.name}`}</div>
          <div className={detailShellClassNames.headerActions}>
            {workbench.headerStageAction ? (
              <Button
                onClick={() => {
                  if (workbench.headerStageAction?.kind === 'completeStage') {
                    void handleCompleteStage();
                    return;
                  }

                  if (workbench.headerStageAction?.kind === 'settleTournament') {
                    void handleSettleTournament();
                    return;
                  }

                  void handleScheduleStage();
                }}
                disabled={workbench.isSubmittingTournamentAction}
              >
                {workbench.headerStageAction.label}
              </Button>
            ) : null}
            {workbench.isWaitingForLineups ? (
              <Button variant="outline" disabled>
                {'\u7b49\u5f85\u4ff1\u4e50\u90e8\u786e\u5b9a\u4eba\u9009'}
              </Button>
            ) : null}
            {workbench.canPublishTournament ? (
              <Button
                variant="secondary"
                onClick={() => void handlePublishTournament()}
                disabled={workbench.isSubmittingTournamentAction}
              >
                发布赛事
              </Button>
            ) : null}
          </div>
        </header>

        <TournamentDetailContent
          activeTab={runtime.activeTab}
          appeals={runtime.appeals}
          appealsError={runtime.appealsError}
          canManageAppeals={runtime.canManageAppeals}
          isSubmittingTableAction={runtime.isSubmittingTableAction}
          operatorId={operatorId}
          participantWaitingTableDetails={
            runtime.participantWaitingTableDetails
          }
          submittingAppealId={runtime.submittingAppealId}
          tableDetailError={runtime.tableDetailError}
          tabItems={runtime.tabItems}
          updatingReadyTableId={runtime.updatingReadyTableId}
          uploadingDemoPaifuTableId={runtime.uploadingDemoPaifuTableId}
          waitingTables={runtime.waitingTables}
          workbench={workbench}
          onActiveTabChange={runtime.setActiveTab}
          onAssignAppeal={(appeal) => void runtime.handleAssignAppeal(appeal)}
          onInviteClub={handleInviteClub}
          onInvitePlayer={handleInvitePlayer}
          onOpenRulesDialog={openRulesDialog}
          onOpenAppealAction={runtime.openAppealActionDialog}
          onSelectClubId={setSelectedClubId}
          onSelectPlayerId={setSelectedPlayerId}
          onSelectManageTable={runtime.setSelectedManageTable}
          onStartManagedTable={(table) =>
            void runtime.handleStartManagedTable(table)
          }
          onToggleOwnReady={(tableId, isReady) =>
            void runtime.handleToggleOwnReady(tableId, isReady)
          }
          onUploadDemoPaifu={(table) =>
            void runtime.handleUploadDemoPaifu(table)
          }
          onToggleShowMore={() => setShowMoreInfo((current) => !current)}
        />
      </section>

      <PublishBlockedDialog
        open={workbench.publishBlockedOpen}
        onOpenChange={setPublishBlockedOpen}
      />

      <TournamentRulesDialog
        open={workbench.rulesDialogOpen}
        draft={workbench.ruleDraft}
        isSubmitting={workbench.isSubmittingTournamentAction}
        hasStage={(workbench.profile.stages?.length ?? 0) > 0}
        onOpenChange={setRulesDialogOpen}
        onDraftChange={setRuleDraft}
        onSubmit={() => void handleSaveRules()}
      />

      <ManagedTableDetailDialog
        selectedManageTable={runtime.selectedManageTable}
        tableDetail={runtime.tableDetail}
        tableDetailError={runtime.tableDetailError}
        isLoadingTableDetail={runtime.isLoadingTableDetail}
        isSubmittingTableAction={runtime.isSubmittingTableAction}
        playerNames={workbench.playerNames}
        onClose={() => runtime.setSelectedManageTable(null)}
        onStartTable={(table, detail) =>
          void runtime.handleStartManagedTable(table, detail)
        }
      />

      <PendingStartConfirmationDialog
        pendingStartConfirmation={runtime.pendingStartConfirmation}
        isSubmittingTableAction={runtime.isSubmittingTableAction}
        onClose={() => runtime.setPendingStartConfirmation(null)}
        onForceStart={() => void runtime.handleForceStartManagedTable()}
      />

      <AppealDecisionDialog
        selectedAppealAction={runtime.selectedAppealAction}
        appealVerdict={runtime.appealVerdict}
        appealActionError={runtime.appealActionError}
        submittingAppealId={runtime.submittingAppealId}
        onClose={runtime.closeAppealDecisionDialog}
        onVerdictChange={runtime.setAppealVerdict}
        onSubmit={() => void runtime.handleSubmitAppealDecision()}
      />
    </>
  );
};
