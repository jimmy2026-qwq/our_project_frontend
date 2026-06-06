import { useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useAuth } from '@/app/auth/useAuth';
import { useRealtimeRefresh } from '@/app/realtime/useRealtimeRefresh';

import { useTournamentDetailHeader } from '../components/TournamentDetailHeader/hooks/useTournamentDetailHeader';
import { useTournamentDetail } from './useTournamentDetail';
import { useTournamentDetailContent } from '../components/TournamentDetailContent/hooks/useTournamentDetailContent';
import { useTournamentDetailWorkbench } from '../components/TournamentDetailContent/hooks/useTournamentDetailWorkbench';
import type { TournamentDetailState } from '../objects/PublicTournamentDetailPage.types';

export function usePublicTournamentDetailPage() {
  const { tournamentId } = useParams();
  const navigate = useNavigate();
  const { session } = useAuth();
  const detail = useTournamentDetail(tournamentId);
  const handleRealtimeRefresh = useCallback(() => {
    detail.refresh();
  }, [detail]);
  useRealtimeRefresh(
    [
      'TournamentChanged',
      'TournamentParticipantChanged',
      'TournamentTableChanged',
      'AppealChanged',
    ],
    handleRealtimeRefresh,
  );
  const state = useMemo<TournamentDetailState>(
    () =>
      detail.state ?? {
        item: null,
        source: 'api',
      },
    [detail.state],
  );
  const workbenchState = useTournamentDetailWorkbench({
    state,
    session,
    navigate,
    onScheduleSuccess: detail.refresh,
  });
  const operatorId = session?.user.operatorId ?? session?.user.userId ?? '';
  const runtime = useTournamentDetailContent({
    operatorId,
    workbench: workbenchState.workbench,
    onScheduleSuccess: detail.refresh,
  });
  const header = useTournamentDetailHeader({
    workbench: workbenchState.workbench,
    onCompleteStage: workbenchState.handleCompleteStage,
    onScheduleStage: workbenchState.handleScheduleStage,
    onSettleTournament: workbenchState.handleSettleTournament,
  });

  return {
    tournamentId,
    isLoading: detail.isLoading && !detail.state,
    isNotFound: !state.item || !workbenchState.workbench,
    workbench: workbenchState.workbench,
    shell: {
      onBack: () => navigate('/public'),
    },
    header: {
      onPublishTournament: () => void workbenchState.handlePublishTournament(),
      onRunHeaderStageAction: header.handleRunHeaderStageAction,
    },
    content: {
      activeTab: runtime.activeTab,
      appeals: runtime.appeals,
      appealsError: runtime.appealsError,
      canManageAppeals: runtime.canManageAppeals,
      isSubmittingTableAction: runtime.isSubmittingTableAction,
      isSubmittingTableAppeal: runtime.isSubmittingAppeal,
      operatorId,
      participantWaitingTableDetails: runtime.participantWaitingTableDetails,
      selectedAppealTable: runtime.selectedAppealTable,
      tableAppealDescription: runtime.appealDescription,
      tableAppealError: runtime.appealError,
      submittingAppealId: runtime.submittingAppealId,
      tableDetailError: runtime.tableDetailError,
      tabItems: runtime.tabItems,
      updatingReadyTableId: runtime.updatingReadyTableId,
      uploadingDemoPaifuTableId: runtime.uploadingDemoPaifuTableId,
      finalizingArchiveTableId: runtime.finalizingArchiveTableId,
      waitingTables: runtime.waitingTables,
      onActiveTabChange: runtime.setActiveTab,
      onAssignAppeal: runtime.handleAssignAppeal,
      onInviteClub: workbenchState.handleInviteClub,
      onInvitePlayer: workbenchState.handleInvitePlayer,
      onOpenRulesDialog: workbenchState.openRulesDialog,
      onOpenAppealAction: runtime.openAppealActionDialog,
      onOpenTableAppeal: runtime.openTableAppealDialog,
      onSelectClubId: workbenchState.setSelectedClubId,
      onSelectPlayerId: workbenchState.setSelectedPlayerId,
      onSelectManageTable: runtime.setSelectedManageTable,
      onStartManagedTable: runtime.handleStartManagedTable,
      onToggleOwnReady: runtime.handleToggleOwnReady,
      onTableAppealOpenChange: runtime.setTableAppealDialogOpen,
      onTableAppealDescriptionChange: runtime.setAppealDescription,
      onSubmitTableAppeal: runtime.handleSubmitTableAppeal,
      onFinalizeArchive: runtime.handleFinalizeArchive,
      onUploadDemoPaifu: runtime.handleUploadDemoPaifu,
      onToggleShowMore: () =>
        workbenchState.setShowMoreInfo((current) => !current),
    },
    dialogs: {
      publishBlockedOpen: workbenchState.workbench?.publishBlockedOpen ?? false,
      rulesDialogOpen: workbenchState.workbench?.rulesDialogOpen ?? false,
      ruleDraft: workbenchState.workbench?.ruleDraft,
      isSubmittingTournamentAction:
        workbenchState.workbench?.isSubmittingTournamentAction ?? false,
      hasStage: (workbenchState.workbench?.profile.stages?.length ?? 0) > 0,
      selectedManageTable: runtime.selectedManageTable,
      tableDetail: runtime.tableDetail,
      tableDetailError: runtime.tableDetailError,
      isLoadingTableDetail: runtime.isLoadingTableDetail,
      isSubmittingTableAction: runtime.isSubmittingTableAction,
      playerNames: workbenchState.workbench?.playerNames ?? {},
      pendingStartConfirmation: runtime.pendingStartConfirmation,
      selectedAppealAction: runtime.selectedAppealAction,
      appealVerdict: runtime.appealVerdict,
      appealActionError: runtime.appealActionError,
      shouldResetTableOnResolve: runtime.shouldResetTableOnResolve,
      submittingAppealId: runtime.submittingAppealId,
      onPublishBlockedOpenChange: workbenchState.setPublishBlockedOpen,
      onRulesDialogOpenChange: workbenchState.setRulesDialogOpen,
      onRuleDraftChange: workbenchState.setRuleDraft,
      onSaveRules: () => void workbenchState.handleSaveRules(),
      onCloseManageTable: () => runtime.setSelectedManageTable(null),
      onStartManagedTable: runtime.handleStartManagedTable,
      onClosePendingStartConfirmation: () =>
        runtime.setPendingStartConfirmation(null),
      onForceStartManagedTable: runtime.handleForceStartManagedTable,
      onCloseAppealDecisionDialog: runtime.closeAppealDecisionDialog,
      onAppealVerdictChange: runtime.setAppealVerdict,
      onShouldResetTableOnResolveChange:
        runtime.setShouldResetTableOnResolve,
      onSubmitAppealDecision: runtime.handleSubmitAppealDecision,
    },
  };
}
