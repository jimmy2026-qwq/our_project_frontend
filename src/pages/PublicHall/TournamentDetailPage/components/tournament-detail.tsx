import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { tournamentApi } from '@/pages/PublicHall/objects/data.transport';
import { EmptyState } from '@/components/ui';
import { cx } from '@/components/ui/cx';
import {
  Alert,
  Button,
  Dialog,
  DialogBody,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogSurface,
  DialogTitle,
  StatusPill,
  Textarea,
} from '@/components/ui';
import type {
  AppealSummary,
  TableDetail,
  TableSeatState,
} from '@/pages/objects/tournament';
import type { TournamentPublicProfile } from '@/pages/PublicHall/objects';
import { useAuth } from '@/app/auth/useAuth';

import type { DetailState } from '@/pages/PublicHall/objects/types';
import { PublicDetailNotFound } from '@/pages/PublicHall/components/shared';
import {
  PublishBlockedDialog,
  TournamentInvitedClubsPanel,
  TournamentOverviewPanel,
} from './tournament-detail.panels';
import {
  getTableStatusLabel,
  getTableStatusTone,
  useTournamentDetailWorkbench,
} from '../hooks/tournament-detail.hooks';
import type { TournamentDetailTableItem } from '../objects/tournament-detail.types';

type TournamentDetailTab = 'home' | 'tables' | 'manage' | 'appeals';
type AppealDecisionType = 'Resolve' | 'Reject' | 'Escalate';

const detailShellClassNames = {
  shell: 'relative grid gap-[18px] text-[#f2f7fb]',
  header:
    'relative grid min-h-[52px] grid-cols-[132px_minmax(0,1fr)] items-center gap-[14px] max-[980px]:min-h-0 max-[980px]:grid-cols-1',
  back:
    'fixed left-7 top-6 z-[5] inline-flex min-h-12 items-center justify-center border-2 !border-[rgba(219,175,98,0.4)] bg-[rgba(28,40,74,0.88)] bg-[linear-gradient(180deg,rgba(29,42,78,0.9),rgba(28,40,74,0.88))] px-[18px] text-[rgba(239,189,111,0.96)] shadow-none max-[980px]:static',
  title:
    'col-start-2 inline-flex min-h-[52px] min-w-[min(100%,640px)] items-center justify-center justify-self-center border-2 !border-[rgba(219,175,98,0.4)] bg-[rgba(28,40,74,0.58)] bg-[linear-gradient(180deg,rgba(29,42,78,0.74),rgba(28,40,74,0.64))] px-9 text-center text-[1.42rem] font-bold text-[rgba(239,189,111,0.98)] shadow-none max-[980px]:col-auto',
  headerActions:
    'absolute right-0 top-1/2 flex -translate-y-1/2 flex-wrap justify-end gap-2.5 max-[980px]:static max-[980px]:translate-y-0',
  frame:
    'grid grid-cols-[132px_minmax(0,1fr)] items-start max-[980px]:grid-cols-1 max-[980px]:gap-[18px]',
  sidebar:
    'relative z-[2] -ml-[72px] grid content-start gap-[14px] overflow-y-auto pt-[22px] max-[980px]:ml-0 max-[980px]:pt-0',
  navItem:
    'relative z-[1] min-h-[72px] cursor-pointer border-2 !border-[rgba(219,175,98,0.4)] bg-[rgba(28,40,74,0.88)] bg-[linear-gradient(180deg,rgba(29,42,78,0.9),rgba(28,40,74,0.88))] px-[18px] py-[14px] text-center !text-[1.18rem] !font-bold tracking-[0.04em] text-[rgba(225,230,243,0.92)] max-[980px]:border-r-2',
  navItemActive: '!border-[rgba(239,189,111,0.5)] text-[rgba(239,189,111,0.96)]',
  content:
    'relative z-[1] box-border grid h-[calc(100vh-190px)] max-h-[calc(100vh-190px)] min-h-[calc(100vh-190px)] grid-rows-[minmax(0,1fr)] overflow-hidden rounded-3xl border-2 !border-[rgba(219,175,98,0.4)] bg-[rgba(9,18,31,0.48)] bg-[linear-gradient(180deg,rgba(13,24,40,0.72),rgba(11,20,34,0.64))] px-[22px] py-[18px] shadow-[0_18px_42px_rgba(5,10,18,0.14),inset_0_1px_0_rgba(255,255,255,0.05)] max-[980px]:h-auto max-[980px]:max-h-none max-[980px]:min-h-0 max-[980px]:overflow-visible',
  contentWithAside:
    'grid-cols-[minmax(0,1.6fr)_minmax(280px,0.9fr)] gap-[18px] max-[980px]:grid-cols-1',
  panel:
    'box-border grid h-full max-h-full min-h-0 grid-rows-[minmax(0,1fr)] overflow-hidden border-2 !border-[rgba(219,175,98,0.32)] bg-[rgba(15,24,46,0.52)] p-[18px] [scrollbar-gutter:stable]',
  panelFull: 'min-h-full',
  list: 'grid h-full min-h-0 grid-rows-[minmax(0,1fr)] gap-[14px]',
  listBody:
    'grid h-full min-h-0 grid-cols-1 auto-rows-auto content-start justify-stretch gap-[14px] overflow-x-hidden overflow-y-scroll [scrollbar-gutter:stable]',
  panelBody:
    'grid h-full max-h-full min-h-0 content-start gap-[14px] overflow-x-hidden overflow-y-auto pr-2.5 [scrollbar-gutter:stable]',
  row:
    'grid items-center gap-[14px] border-2 !border-[rgba(219,175,98,0.38)] bg-[rgba(28,40,74,0.88)] bg-[linear-gradient(180deg,rgba(29,42,78,0.9),rgba(28,40,74,0.88))] px-[18px] py-4 max-[980px]:grid-cols-1 max-[980px]:items-start min-[981px]:grid-cols-[minmax(0,1fr)_auto]',
  rowMain:
    'grid gap-2 [&_span]:text-[rgba(225,230,243,0.92)] [&_strong]:text-[rgba(239,189,111,0.96)]',
  rowSide:
    'grid min-w-[132px] items-center justify-items-end gap-2 text-[rgba(225,230,243,0.92)] max-[980px]:justify-items-start',
  actionRow:
    'flex flex-nowrap items-center justify-end gap-2.5 max-[980px]:flex-wrap max-[980px]:justify-start',
  action:
    'mt-0 inline-flex min-w-28 cursor-pointer items-center justify-center border !border-[rgba(219,175,98,0.36)] bg-[rgba(56,85,162,0.92)] bg-[linear-gradient(180deg,rgba(83,124,210,0.92),rgba(56,85,162,0.92))] px-[22px] py-2.5 text-center text-[#f5c98e] no-underline',
  actionPrepare:
    'bg-[linear-gradient(180deg,rgba(232,191,108,0.96),rgba(193,142,54,0.94))] text-[rgba(67,38,12,0.96)]',
  actionReady:
    'bg-[linear-gradient(180deg,rgba(83,124,210,0.92),rgba(56,85,162,0.92))] text-[#f5c98e]',
  actionDisabled:
    'mt-0 inline-flex min-w-28 cursor-not-allowed items-center justify-center border !border-[rgba(219,175,98,0.22)] bg-[rgba(67,74,95,0.56)] bg-[linear-gradient(180deg,rgba(92,102,126,0.56),rgba(67,74,95,0.56))] px-[22px] py-2.5 text-center text-[rgba(225,230,243,0.62)]',
  seatRow:
    'grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-4 border-t border-[rgba(219,175,98,0.16)] py-[14px] first:border-t-0 max-[980px]:grid-cols-1',
};

function getSeatStatusTone(seat: TableSeatState) {
  if (seat.disconnected) {
    return 'danger' as const;
  }

  if (seat.ready) {
    return 'success' as const;
  }

  return 'warning' as const;
}

function getSeatStatusLabel(seat: TableSeatState) {
  if (seat.disconnected) {
    return '已断线';
  }

  if (seat.ready) {
    return '已准备';
  }

  return '待准备';
}

function getAppealStatusTone(status: AppealSummary['status']) {
  switch (status) {
    case 'Resolved':
      return 'success' as const;
    case 'Rejected':
      return 'danger' as const;
    case 'UnderReview':
      return 'neutral' as const;
    case 'Escalated':
    case 'Open':
    default:
      return 'warning' as const;
  }
}

function getAppealStatusLabel(status: AppealSummary['status']) {
  switch (status) {
    case 'Open':
      return '\u5f85\u5904\u7406';
    case 'UnderReview':
      return '\u5ba1\u6838\u4e2d';
    case 'Resolved':
      return '\u5df2\u5904\u7406';
    case 'Rejected':
      return '\u5df2\u9a73\u56de';
    case 'Escalated':
      return '\u5df2\u5347\u7ea7';
    default:
      return status;
  }
}

function getAppealDecisionLabel(decision: AppealDecisionType) {
  switch (decision) {
    case 'Resolve':
      return '解决';
    case 'Reject':
      return '驳回';
    case 'Escalate':
      return '升级';
    default:
      return decision;
  }
}

function formatDateTime(value?: string | null) {
  if (!value) {
    return '--';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString('zh-CN');
}

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
    setPublishBlockedOpen,
    setShowMoreInfo,
    handleInviteClub,
    handlePublishTournament,
    handleScheduleStage,
  } = useTournamentDetailWorkbench({
    state,
    session,
    navigate,
    onScheduleSuccess,
  });

  const [activeTab, setActiveTab] = useState<TournamentDetailTab>('home');
  const [appeals, setAppeals] = useState<AppealSummary[]>([]);
  const [appealsError, setAppealsError] = useState('');
  const [selectedManageTable, setSelectedManageTable] =
    useState<TournamentDetailTableItem | null>(null);
  const [tableDetail, setTableDetail] = useState<TableDetail | null>(null);
  const [tableDetailError, setTableDetailError] = useState('');
  const [isLoadingTableDetail, setIsLoadingTableDetail] = useState(false);
  const [isSubmittingTableAction, setIsSubmittingTableAction] = useState(false);
  const [pendingStartConfirmation, setPendingStartConfirmation] = useState<{
    tableId: string;
    tableCode: string;
    unreadyPlayerNames: string[];
  } | null>(null);
  const [participantWaitingTableDetails, setParticipantWaitingTableDetails] =
    useState<Record<string, TableDetail>>({});
  const [updatingReadyTableId, setUpdatingReadyTableId] = useState('');
  const [selectedAppealAction, setSelectedAppealAction] = useState<{
    appeal: AppealSummary;
    decision: AppealDecisionType;
  } | null>(null);
  const [appealVerdict, setAppealVerdict] = useState('');
  const [appealActionError, setAppealActionError] = useState('');
  const [submittingAppealId, setSubmittingAppealId] = useState('');

  useEffect(() => {
    if (!workbench?.canManageTournament) {
      setActiveTab('home');
    }
  }, [workbench?.canManageTournament]);

  useEffect(() => {
    if (!workbench?.canManageTournament || !workbench.profile.id) {
      setAppeals([]);
      setAppealsError('');
      return;
    }

    let cancelled = false;

    void tournamentApi
      .getAppeals({ tournamentId: workbench.profile.id, limit: 50, offset: 0 })
      .then((envelope) => {
        if (!cancelled) {
          setAppeals(envelope.items);
          setAppealsError('');
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setAppeals([]);
          setAppealsError(
            error instanceof Error ? error.message : '无法加载申诉工单。',
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [workbench?.canManageTournament, workbench?.profile.id]);

  useEffect(() => {
    if (!selectedManageTable) {
      setTableDetail(null);
      setTableDetailError('');
      return;
    }

    let cancelled = false;
    setIsLoadingTableDetail(true);

    void tournamentApi
      .getTable(selectedManageTable.id)
      .then((detail) => {
        if (!cancelled) {
          setTableDetail(detail);
          setTableDetailError('');
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setTableDetail(null);
          setTableDetailError(
            error instanceof Error ? error.message : '无法加载牌桌详情。',
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoadingTableDetail(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selectedManageTable]);

  const operatorId = session?.user.operatorId ?? session?.user.userId ?? '';
  const canManageAppeals = !!workbench?.canManageTournament && !!operatorId;

  useEffect(() => {
    if (!operatorId || !workbench?.visibleTables.length) {
      setParticipantWaitingTableDetails({});
      return;
    }

    const participantWaitingTables = workbench.visibleTables.filter(
      (table) =>
        table.status === 'WaitingPreparation' &&
        table.playerIds.includes(operatorId),
    );

    if (participantWaitingTables.length === 0) {
      setParticipantWaitingTableDetails({});
      return;
    }

    let cancelled = false;

    void Promise.all(
      participantWaitingTables.map(async (table) => {
        try {
          const detail = await tournamentApi.getTable(table.id);
          return [table.id, detail] as const;
        } catch {
          return [table.id, null] as const;
        }
      }),
    ).then((entries) => {
      if (!cancelled) {
        setParticipantWaitingTableDetails(
          Object.fromEntries(
            entries.filter(
              (entry): entry is readonly [string, TableDetail] =>
                entry[1] !== null,
            ),
          ),
        );
      }
    });

    return () => {
      cancelled = true;
    };
  }, [operatorId, workbench?.visibleTables]);

  const waitingTables = useMemo(
    () =>
      (workbench?.visibleTables ?? []).filter(
        (table) => table.status === 'WaitingPreparation',
      ),
    [workbench?.visibleTables],
  );
  const playerNameMap = workbench?.playerNames ?? {};

  if (!state.item || !workbench) {
    return <PublicDetailNotFound title="Tournament not found" />;
  }

  const tabItems: Array<{ id: TournamentDetailTab; label: string }> = [
    { id: 'home', label: '赛事概览' },
    { id: 'tables', label: '赛事牌桌' },
    ...(workbench.canManageTournament
      ? [
          { id: 'manage' as const, label: '牌桌管理' },
          { id: 'appeals' as const, label: '查看申诉' },
        ]
      : []),
  ];

  async function actuallyStartManagedTable(tableId: string) {
    if (!operatorId) {
      return;
    }

    try {
      setIsSubmittingTableAction(true);
      setTableDetailError('');
      await tournamentApi.startTable(tableId, { operatorId });
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
      const detail = knownDetail ?? (await tournamentApi.getTable(table.id));
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
        error instanceof Error
          ? error.message
          : '\u65e0\u6cd5\u68c0\u67e5\u724c\u684c\u51c6\u5907\u60c5\u51b5\u3002',
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

  async function handleToggleOwnReady(tableId: string, isReady: boolean) {
    if (!operatorId) {
      return;
    }

    try {
      setUpdatingReadyTableId(tableId);
      setTableDetailError('');
      const nextDetail = await tournamentApi.updateOwnReadyState(tableId, {
        operatorId,
        ready: !isReady,
      });
      setParticipantWaitingTableDetails((current) => ({
        ...current,
        [tableId]: nextDetail,
      }));
    } catch (error) {
      setTableDetailError(
        error instanceof Error ? error.message : '无法更新你的准备状态。',
      );
    } finally {
      setUpdatingReadyTableId('');
    }
  }

  function updateAppealLocally(nextAppeal: AppealSummary) {
    setAppeals((current) =>
      current.map((appeal) =>
        appeal.id === nextAppeal.id ? { ...appeal, ...nextAppeal } : appeal,
      ),
    );
  }

  function openAppealActionDialog(
    appeal: AppealSummary,
    decision: AppealDecisionType,
  ) {
    setSelectedAppealAction({ appeal, decision });
    setAppealActionError('');
    setAppealVerdict(
      decision === 'Resolve'
        ? '已核实申诉内容，工单处理完成。'
        : decision === 'Reject'
          ? '已核实当前情况，申诉不成立。'
          : '当前申诉需要进一步升级处理。',
    );
  }

  async function handleAssignAppeal(appeal: AppealSummary) {
    if (!operatorId) {
      return;
    }

    try {
      setSubmittingAppealId(appeal.id);
      setAppealsError('');
      const nextAppeal = await tournamentApi.updateAppealWorkflow(appeal.id, {
        operatorId,
        assigneeId: operatorId,
        note: '赛事管理员已认领此工单。',
      });
      updateAppealLocally({
        ...appeal,
        ...nextAppeal,
        assigneeId: nextAppeal.assigneeId ?? operatorId,
      });
    } catch (error) {
      setAppealsError(
        error instanceof Error ? error.message : '无法更新申诉工单。',
      );
    } finally {
      setSubmittingAppealId('');
    }
  }

  async function handleSubmitAppealDecision() {
    if (!selectedAppealAction || !operatorId) {
      return;
    }

    const verdict = appealVerdict.trim();
    if (!verdict) {
      setAppealActionError('请先填写处理结论。');
      return;
    }

    try {
      setSubmittingAppealId(selectedAppealAction.appeal.id);
      setAppealsError('');
      setAppealActionError('');
      const nextAppeal = await tournamentApi.adjudicateAppeal(
        selectedAppealAction.appeal.id,
        {
          operatorId,
          decision: selectedAppealAction.decision,
          verdict,
          note: `赛事管理员执行了${getAppealDecisionLabel(selectedAppealAction.decision)}操作。`,
        },
      );
      updateAppealLocally(nextAppeal);
      setSelectedAppealAction(null);
      setAppealVerdict('');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : '无法处理申诉工单。';
      setAppealActionError(message);
      setAppealsError(message);
    } finally {
      setSubmittingAppealId('');
    }
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
            {workbench.canScheduleStage ? (
              <Button
                onClick={() => void handleScheduleStage()}
                disabled={workbench.isSubmittingTournamentAction}
              >
                赛段排桌
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
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </aside>

          <div
            className={cx(
              detailShellClassNames.content,
              activeTab === 'home' ? detailShellClassNames.contentWithAside : '',
            )}
          >
            {workbench.tournamentActionError ? (
              <Alert variant="danger">{workbench.tournamentActionError}</Alert>
            ) : null}

            {activeTab === 'home' ? (
              <>
                <div className={detailShellClassNames.panel}>
                  <section className={detailShellClassNames.list}>
                    <div className={detailShellClassNames.panelBody}>
                      <TournamentOverviewPanel
                        profile={workbench.profile}
                        showMoreInfo={workbench.showMoreInfo}
                        onToggleShowMore={() =>
                          setShowMoreInfo((current) => !current)
                        }
                      />
                    </div>
                  </section>
                </div>
                <div className={detailShellClassNames.panel}>
                  <section className={detailShellClassNames.list}>
                    <div className={detailShellClassNames.panelBody}>
                      <TournamentInvitedClubsPanel
                        invitedClubs={workbench.invitedClubs}
                        lineupSubmissionCounts={
                          workbench.lineupSubmissionCounts
                        }
                        selectableClubs={workbench.selectableClubs}
                        selectedClubId={workbench.selectedClubId}
                        canManageTournament={workbench.canManageTournament}
                        isSubmittingTournamentAction={
                          workbench.isSubmittingTournamentAction
                        }
                        onSelectedClubIdChange={setSelectedClubId}
                        onInviteClub={() => void handleInviteClub()}
                      />
                    </div>
                  </section>
                </div>
              </>
            ) : null}

            {activeTab === 'tables' ? (
              <div className={cx(detailShellClassNames.panel, detailShellClassNames.panelFull)}>
                <section className={detailShellClassNames.list}>
                  <div className={detailShellClassNames.listBody}>
                    {tableDetailError ? (
                      <Alert variant="danger">{tableDetailError}</Alert>
                    ) : null}
                    {workbench.visibleTables.length > 0 ? (
                      workbench.visibleTables.map((table) => {
                        const playerLabel = table.playerIds
                          .map(
                            (playerId) =>
                              workbench.playerNames[playerId] ?? playerId,
                          )
                          .join(' / ');
                        const isFinished = table.status === 'Archived';
                        const isWaiting = table.status === 'WaitingPreparation';
                        const participantTableDetail =
                          participantWaitingTableDetails[table.id];
                        const ownSeat =
                          participantTableDetail?.seats.find(
                            (seat) => seat.playerId === operatorId,
                          ) ?? null;
                        const canUpdateOwnReady =
                          table.status === 'WaitingPreparation' &&
                          !!ownSeat &&
                          !ownSeat.disconnected;

                        return (
                          <article
                            key={table.id}
                            className={detailShellClassNames.row}
                          >
                            <div className={detailShellClassNames.rowMain}>
                              <strong>{table.tableCode}</strong>
                              <span>{table.stageName}</span>
                              <span>{playerLabel}</span>
                            </div>
                            <div className={detailShellClassNames.rowSide}>
                              <StatusPill
                                tone={getTableStatusTone(table.status)}
                              >
                                {getTableStatusLabel(table.status)}
                              </StatusPill>
                              <div className={detailShellClassNames.actionRow}>
                                {canUpdateOwnReady ? (
                                  <button
                                    type="button"
                                    className={cx(
                                      detailShellClassNames.action,
                                      ownSeat.ready
                                        ? detailShellClassNames.actionReady
                                        : detailShellClassNames.actionPrepare,
                                    )}
                                    onClick={() =>
                                      void handleToggleOwnReady(
                                        table.id,
                                        ownSeat.ready,
                                      )
                                    }
                                    disabled={updatingReadyTableId === table.id}
                                  >
                                    {updatingReadyTableId === table.id
                                      ? '处理中...'
                                      : ownSeat.ready
                                        ? '取消准备'
                                        : '标记准备'}
                                  </button>
                                ) : null}
                                {isWaiting ? (
                                  <span className={detailShellClassNames.actionDisabled}>
                                    等待开桌
                                  </span>
                                ) : (
                                  <Link
                                    className={detailShellClassNames.action}
                                    to={
                                      isFinished
                                        ? `/tables/${table.id}/paifu`
                                        : `/tables/${table.id}`
                                    }
                                  >
                                    {isFinished ? '查看牌谱' : '进入牌桌'}
                                  </Link>
                                )}
                              </div>
                            </div>
                          </article>
                        );
                      })
                    ) : (
                      <EmptyState asListItem={false}>
                        当前还没有可展示的赛事牌桌。
                      </EmptyState>
                    )}
                  </div>
                </section>
              </div>
            ) : null}

            {activeTab === 'manage' ? (
              <div className={cx(detailShellClassNames.panel, detailShellClassNames.panelFull)}>
                <section className={detailShellClassNames.list}>
                  <div className={detailShellClassNames.listBody}>
                    {waitingTables.length > 0 ? (
                      waitingTables.map((table) => (
                        <article
                          key={table.id}
                          className={detailShellClassNames.row}
                        >
                          <div className={detailShellClassNames.rowMain}>
                            <strong>{table.tableCode}</strong>
                            <span>{table.stageName}</span>
                            <span>
                              {table.playerIds
                                .map(
                                  (playerId) =>
                                    workbench.playerNames[playerId] ?? playerId,
                                )
                                .join(' / ')}
                            </span>
                          </div>
                          <div className={detailShellClassNames.rowSide}>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedManageTable(table)}
                            >
                              查看详情
                            </Button>
                            <Button
                              size="sm"
                              onClick={() =>
                                void handleStartManagedTable(table)
                              }
                              disabled={isSubmittingTableAction}
                            >
                              开启牌桌
                            </Button>
                          </div>
                        </article>
                      ))
                    ) : (
                      <EmptyState asListItem={false}>
                        当前没有待开启的牌桌。
                      </EmptyState>
                    )}
                  </div>
                </section>
              </div>
            ) : null}

            {activeTab === 'appeals' ? (
              <div className={cx(detailShellClassNames.panel, detailShellClassNames.panelFull)}>
                <section className={detailShellClassNames.list}>
                  <div className={detailShellClassNames.listBody}>
                    {appealsError ? (
                      <Alert variant="danger">{appealsError}</Alert>
                    ) : null}
                    {appeals.length > 0 ? (
                      appeals.map((appeal) => {
                        const submitterId =
                          appeal.openedBy ?? appeal.createdBy ?? '';
                        const submitterLabel = submitterId
                          ? (workbench.playerNames[submitterId] ?? submitterId)
                          : '--';
                        const isAppealClaimed = !!appeal.assigneeId;
                        const appealResultText =
                          appeal.resolution ??
                          appeal.verdict ??
                          '\u5f85\u5904\u7406';
                        const appealStatusText =
                          appeal.status === 'Open'
                            ? appealResultText
                            : getAppealStatusLabel(appeal.status) ||
                              appealResultText;
                        const assigneeLabel = appeal.assigneeId
                          ? (workbench.playerNames[appeal.assigneeId] ??
                            appeal.assigneeId)
                          : '未认领';

                        return (
                          <article
                            key={appeal.id}
                            className={detailShellClassNames.row}
                          >
                            <div className={detailShellClassNames.rowMain}>
                              <strong>{appeal.id}</strong>
                              <span>{`牌桌：${appeal.tableId}`}</span>
                              <span>{`提交人：${submitterLabel}`}</span>
                              <span>{`提交时间：${formatDateTime(appeal.createdAt)}`}</span>
                              <span>
                                {appeal.description || '未填写申诉说明。'}
                              </span>
                            </div>
                            <div className={detailShellClassNames.rowSide}>
                              <StatusPill
                                tone={getAppealStatusTone(appeal.status)}
                              >
                                {appealStatusText}
                              </StatusPill>
                              <span>{`处理人：${assigneeLabel}`}</span>
                              <span>{`处理结果：${appeal.resolution ?? appeal.verdict ?? '待处理'}`}</span>
                              <span>{`最近更新：${formatDateTime(appeal.updatedAt ?? appeal.createdAt)}`}</span>
                              {appeal.status !== 'Resolved' &&
                              appeal.status !== 'Rejected' ? (
                                <div className={detailShellClassNames.actionRow}>
                                  {canManageAppeals && !isAppealClaimed ? (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        void handleAssignAppeal(appeal)
                                      }
                                      disabled={
                                        submittingAppealId === appeal.id
                                      }
                                    >
                                      认领到我
                                    </Button>
                                  ) : null}
                                  {canManageAppeals ? (
                                    <Button
                                      size="sm"
                                      onClick={() =>
                                        openAppealActionDialog(
                                          appeal,
                                          'Resolve',
                                        )
                                      }
                                      disabled={
                                        submittingAppealId === appeal.id ||
                                        !isAppealClaimed
                                      }
                                    >
                                      解决
                                    </Button>
                                  ) : null}
                                  {canManageAppeals ? (
                                    <Button
                                      variant="secondary"
                                      size="sm"
                                      onClick={() =>
                                        openAppealActionDialog(appeal, 'Reject')
                                      }
                                      disabled={
                                        submittingAppealId === appeal.id ||
                                        !isAppealClaimed
                                      }
                                    >
                                      驳回
                                    </Button>
                                  ) : null}
                                  {canManageAppeals &&
                                  appeal.status !== 'Escalated' ? (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        openAppealActionDialog(
                                          appeal,
                                          'Escalate',
                                        )
                                      }
                                      disabled={
                                        submittingAppealId === appeal.id
                                      }
                                    >
                                      升级
                                    </Button>
                                  ) : null}
                                </div>
                              ) : null}
                            </div>
                          </article>
                        );
                      })
                    ) : (
                      <EmptyState asListItem={false}>
                        当前还没有赛事申诉工单。
                      </EmptyState>
                    )}
                  </div>
                </section>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <PublishBlockedDialog
        open={workbench.publishBlockedOpen}
        onOpenChange={setPublishBlockedOpen}
      />

      <Dialog
        open={!!selectedManageTable}
        onOpenChange={(open) => !open && setSelectedManageTable(null)}
      >
        <DialogPortal>
          <DialogOverlay />
          <DialogSurface>
            <DialogHeader className="border-b border-[rgba(176,223,229,0.14)] px-6 py-5">
              <DialogTitle>
                {selectedManageTable
                  ? `${selectedManageTable.tableCode} 牌桌详情`
                  : '牌桌详情'}
              </DialogTitle>
            </DialogHeader>
            <DialogBody className="grid gap-4 px-6 py-5">
              {isLoadingTableDetail ? (
                <p className="m-0 text-[#9ab0c1]">
                  正在加载牌桌详情...
                </p>
              ) : null}
              {tableDetailError ? (
                <Alert variant="danger">{tableDetailError}</Alert>
              ) : null}
              {tableDetail?.seats.map((seat) => (
                <div key={seat.seat} className={detailShellClassNames.seatRow}>
                  <div className="grid gap-1">
                    <strong>{seat.seat}</strong>
                    <span>
                      {workbench.playerNames[seat.playerId] ?? seat.playerId}
                    </span>
                  </div>
                  <StatusPill tone={getSeatStatusTone(seat)}>
                    {getSeatStatusLabel(seat)}
                  </StatusPill>
                  <StatusPill tone={seat.disconnected ? 'danger' : 'neutral'}>
                    {seat.disconnected ? '连接异常' : '连接正常'}
                  </StatusPill>
                </div>
              ))}
            </DialogBody>
            <DialogFooter className="border-t border-[rgba(176,223,229,0.14)] px-6 py-5">
              <Button
                variant="secondary"
                onClick={() => setSelectedManageTable(null)}
              >
                关闭
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  selectedManageTable &&
                  void handleStartManagedTable(selectedManageTable, tableDetail)
                }
                disabled={!selectedManageTable || isSubmittingTableAction}
              >
                开启牌桌
              </Button>
            </DialogFooter>
          </DialogSurface>
        </DialogPortal>
      </Dialog>

      <Dialog
        open={!!pendingStartConfirmation}
        onOpenChange={(open) => {
          if (!open) {
            setPendingStartConfirmation(null);
          }
        }}
      >
        <DialogPortal>
          <DialogOverlay />
          <DialogSurface>
            <DialogHeader className="border-b border-[rgba(176,223,229,0.14)] px-6 py-5">
              <DialogTitle>
                {pendingStartConfirmation
                  ? `${pendingStartConfirmation.tableCode} \u8fd8\u6709\u73a9\u5bb6\u672a\u51c6\u5907`
                  : '\u8fd8\u6709\u73a9\u5bb6\u672a\u51c6\u5907'}
              </DialogTitle>
              <DialogDescription>
                {
                  '\u4ee5\u4e0b\u73a9\u5bb6\u8fd8\u6ca1\u6709\u5b8c\u6210\u51c6\u5907\uff0c\u53ef\u4ee5\u9009\u62e9\u518d\u7b49\u7b49\uff0c\u6216\u8005\u76f4\u63a5\u5f3a\u5236\u5f00\u684c\u3002'
                }
              </DialogDescription>
            </DialogHeader>
            <DialogBody className="grid gap-4 px-6 py-5">
              <div className="grid gap-2 rounded-[20px] border border-[rgba(236,197,122,0.22)] bg-[rgba(236,197,122,0.08)] p-4">
                {pendingStartConfirmation?.unreadyPlayerNames.map(
                  (playerName) => (
                    <span
                      key={playerName}
                      className="text-sm text-[#c7d6e2]"
                    >
                      {playerName}
                    </span>
                  ),
                )}
              </div>
            </DialogBody>
            <DialogFooter className="border-t border-[rgba(176,223,229,0.14)] px-6 py-5">
              <Button
                variant="secondary"
                onClick={() => setPendingStartConfirmation(null)}
                disabled={isSubmittingTableAction}
              >
                {'\u518d\u7b49\u7b49'}
              </Button>
              <Button
                onClick={() => void handleForceStartManagedTable()}
                disabled={isSubmittingTableAction}
              >
                {isSubmittingTableAction
                  ? '\u5904\u7406\u4e2d...'
                  : '\u5f3a\u5236\u5f00\u684c'}
              </Button>
            </DialogFooter>
          </DialogSurface>
        </DialogPortal>
      </Dialog>

      <Dialog
        open={!!selectedAppealAction}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedAppealAction(null);
            setAppealVerdict('');
            setAppealActionError('');
          }
        }}
      >
        <DialogPortal>
          <DialogOverlay />
          <DialogSurface>
            <DialogHeader className="border-b border-[rgba(176,223,229,0.14)] px-6 py-5">
              <DialogTitle>
                {selectedAppealAction
                  ? `${getAppealDecisionLabel(selectedAppealAction.decision)}申诉工单`
                  : '处理申诉工单'}
              </DialogTitle>
              <DialogDescription>
                {selectedAppealAction
                  ? `工单 ${selectedAppealAction.appeal.id} 将被标记为“${getAppealDecisionLabel(selectedAppealAction.decision)}”。`
                  : '填写处理结论后提交。'}
              </DialogDescription>
            </DialogHeader>
            <DialogBody className="grid gap-4 px-6 py-5">
              {appealActionError ? (
                <Alert variant="danger">{appealActionError}</Alert>
              ) : null}
              {selectedAppealAction ? (
                <div className="grid gap-2 rounded-[20px] border border-[rgba(176,223,229,0.14)] bg-[rgba(255,255,255,0.03)] p-4 text-sm text-[#c7d6e2]">
                  <strong className="text-[#f2f7fb]">
                    {selectedAppealAction.appeal.id}
                  </strong>
                  <span>{`牌桌：${selectedAppealAction.appeal.tableId}`}</span>
                  <span>
                    {selectedAppealAction.appeal.description ||
                      '未填写申诉说明。'}
                  </span>
                </div>
              ) : null}
              <label className="grid gap-3 text-sm text-[#c7d6e2]">
                <span className="font-medium text-[#f2f7fb]">
                  处理结论
                </span>
                <Textarea
                  value={appealVerdict}
                  onChange={(event) => setAppealVerdict(event.target.value)}
                  placeholder="请填写这次申诉的处理说明。"
                  maxLength={1000}
                />
              </label>
            </DialogBody>
            <DialogFooter className="border-t border-[rgba(176,223,229,0.14)] px-6 py-5 sm:grid-cols-[1fr_auto_auto] sm:items-center">
              <p className="m-0 text-sm text-[#9ab0c1]">
                {selectedAppealAction
                  ? `当前操作：${getAppealDecisionLabel(selectedAppealAction.decision)}`
                  : ''}
              </p>
              <Button
                variant="secondary"
                onClick={() => {
                  setSelectedAppealAction(null);
                  setAppealVerdict('');
                  setAppealActionError('');
                }}
                disabled={!!submittingAppealId}
              >
                取消
              </Button>
              <Button
                onClick={() => void handleSubmitAppealDecision()}
                disabled={!selectedAppealAction || !!submittingAppealId}
              >
                {submittingAppealId ? '提交中...' : '确认提交'}
              </Button>
            </DialogFooter>
          </DialogSurface>
        </DialogPortal>
      </Dialog>
    </>
  );
};
