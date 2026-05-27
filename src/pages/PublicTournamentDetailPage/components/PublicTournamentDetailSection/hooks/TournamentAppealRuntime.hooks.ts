import { useEffect, useState } from 'react';

import {
  AppealAdjudicateAPI,
  AppealListAPI,
  AppealUpdateWorkflowAPI,
} from '@/api/tournament';
import type { AppealSummary } from '@/pages/objects/tournament';
import { sendAPI } from '@/system/api';
import { mapEnvelope } from '@/system/api/http';

import type { TournamentDetailWorkbenchState } from '../../../objects/tournament-detail.types';
import {
  type AppealDecisionType,
  getAppealDecisionLabel,
} from '../../../objects/tournament-detail.view';
import { mapAppeal } from '../../../objects/mappers';

export function useTournamentAppealRuntime({
  operatorId,
  workbench,
}: {
  operatorId: string;
  workbench: TournamentDetailWorkbenchState | null;
}) {
  const [appeals, setAppeals] = useState<AppealSummary[]>([]);
  const [appealsError, setAppealsError] = useState('');
  const [selectedAppealAction, setSelectedAppealAction] = useState<{
    appeal: AppealSummary;
    decision: AppealDecisionType;
  } | null>(null);
  const [appealVerdict, setAppealVerdict] = useState('');
  const [appealActionError, setAppealActionError] = useState('');
  const [submittingAppealId, setSubmittingAppealId] = useState('');

  useEffect(() => {
    if (!workbench?.canManageTournament || !workbench.profile.id) {
      setAppeals([]);
      setAppealsError('');
      return;
    }

    let cancelled = false;

    void sendAPI(
      new AppealListAPI({
        tournamentId: workbench.profile.id,
        limit: 50,
        offset: 0,
      }),
    )
      .then((envelope) => mapEnvelope(envelope, mapAppeal))
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
      const nextAppeal = await sendAPI(
        new AppealUpdateWorkflowAPI(appeal.id, {
          operatorId,
          assigneeId: operatorId,
          note: '赛事管理员已认领此工单。',
        }),
      ).then(mapAppeal);
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
      const nextAppeal = await sendAPI(
        new AppealAdjudicateAPI(selectedAppealAction.appeal.id, {
          operatorId,
          decision: selectedAppealAction.decision,
          verdict,
          note: `赛事管理员执行了${getAppealDecisionLabel(selectedAppealAction.decision)}操作。`,
        }),
      ).then(mapAppeal);
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
    appealActionError,
    appealVerdict,
    appeals,
    appealsError,
    selectedAppealAction,
    submittingAppealId,
    closeAppealDecisionDialog,
    handleAssignAppeal,
    handleSubmitAppealDecision,
    openAppealActionDialog,
    setAppealVerdict,
  };
}
