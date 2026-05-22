import { useEffect, useMemo, useState } from 'react';

import { tournamentApi } from '@/pages/PublicHall/objects/data.transport';
import type { AppealSummary, TableDetail } from '@/pages/objects/tournament';

import type {
  TournamentDetailTableItem,
  TournamentDetailWorkbenchState,
} from '../objects/tournament-detail.types';
import {
  type AppealDecisionType,
  type TournamentDetailTab,
  getAppealDecisionLabel,
} from '../objects/tournament-detail.view';

export function useTournamentDetailRuntime({
  operatorId,
  workbench,
  onScheduleSuccess,
}: {
  operatorId: string;
  workbench: TournamentDetailWorkbenchState | null;
  onScheduleSuccess?: () => void;
}) {
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
  const canManageAppeals = !!workbench?.canManageTournament && !!operatorId;
  const tabItems: Array<{ id: TournamentDetailTab; label: string }> = [
    { id: 'home', label: '赛事概览' },
    { id: 'rules', label: '规则说明' },
    { id: 'participants', label: '\u53c2\u8d5b\u540d\u5355' },
    { id: 'tables', label: '赛事牌桌' },
    ...(workbench?.canManageTournament
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

  function closeAppealDecisionDialog() {
    setSelectedAppealAction(null);
    setAppealVerdict('');
    setAppealActionError('');
  }

  return {
    activeTab,
    appealActionError,
    appealVerdict,
    appeals,
    appealsError,
    canManageAppeals,
    isLoadingTableDetail,
    isSubmittingTableAction,
    participantWaitingTableDetails,
    pendingStartConfirmation,
    selectedAppealAction,
    selectedManageTable,
    submittingAppealId,
    tableDetail,
    tableDetailError,
    tabItems,
    updatingReadyTableId,
    waitingTables,
    closeAppealDecisionDialog,
    handleAssignAppeal,
    handleForceStartManagedTable,
    handleStartManagedTable,
    handleSubmitAppealDecision,
    handleToggleOwnReady,
    openAppealActionDialog,
    setActiveTab,
    setAppealVerdict,
    setPendingStartConfirmation,
    setSelectedManageTable,
  };
}
