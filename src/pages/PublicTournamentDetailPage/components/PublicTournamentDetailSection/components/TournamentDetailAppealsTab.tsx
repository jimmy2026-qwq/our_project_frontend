import { Alert, Button, EmptyState, StatusPill } from '@/components/ui';
import { cx } from '@/components/ui/cx';
import type { AppealSummary } from '@/pages/objects/tournament';

import { detailShellClassNames } from '../styles';
import type { TournamentDetailWorkbenchState } from '../../../objects/tournament-detail.types';
import {
  type AppealDecisionType,
  formatDateTime,
  getAppealStatusLabel,
  getAppealStatusTone,
} from '../../../objects/tournament-detail.view';

export function TournamentDetailAppealsTab({
  appeals,
  appealsError,
  canManageAppeals,
  submittingAppealId,
  workbench,
  onAssignAppeal,
  onOpenAppealAction,
}: {
  appeals: AppealSummary[];
  appealsError: string;
  canManageAppeals: boolean;
  submittingAppealId: string;
  workbench: TournamentDetailWorkbenchState;
  onAssignAppeal: (appeal: AppealSummary) => void;
  onOpenAppealAction: (
    appeal: AppealSummary,
    decision: AppealDecisionType,
  ) => void;
}) {
  return (
    <div
      className={cx(
        detailShellClassNames.panel,
        detailShellClassNames.panelFull,
      )}
    >
      <section className={detailShellClassNames.list}>
        <div className={detailShellClassNames.listBody}>
          {appealsError ? <Alert variant="danger">{appealsError}</Alert> : null}
          {appeals.length > 0 ? (
            appeals.map((appeal) => (
              <AppealRow
                key={appeal.id}
                appeal={appeal}
                canManageAppeals={canManageAppeals}
                submittingAppealId={submittingAppealId}
                workbench={workbench}
                onAssignAppeal={onAssignAppeal}
                onOpenAppealAction={onOpenAppealAction}
              />
            ))
          ) : (
            <EmptyState asListItem={false}>当前还没有赛事申诉工单。</EmptyState>
          )}
        </div>
      </section>
    </div>
  );
}

function AppealRow({
  appeal,
  canManageAppeals,
  submittingAppealId,
  workbench,
  onAssignAppeal,
  onOpenAppealAction,
}: {
  appeal: AppealSummary;
  canManageAppeals: boolean;
  submittingAppealId: string;
  workbench: TournamentDetailWorkbenchState;
  onAssignAppeal: (appeal: AppealSummary) => void;
  onOpenAppealAction: (
    appeal: AppealSummary,
    decision: AppealDecisionType,
  ) => void;
}) {
  const submitterId = appeal.openedBy ?? appeal.createdBy ?? '';
  const submitterLabel = submitterId
    ? (workbench.playerNames[submitterId] ?? submitterId)
    : '--';
  const isAppealClaimed = !!appeal.assigneeId;
  const appealResultText =
    appeal.resolution ?? appeal.verdict ?? '\u5f85\u5904\u7406';
  const appealStatusText =
    appeal.status === 'Open'
      ? appealResultText
      : getAppealStatusLabel(appeal.status) || appealResultText;
  const assigneeLabel = appeal.assigneeId
    ? (workbench.playerNames[appeal.assigneeId] ?? appeal.assigneeId)
    : '未认领';

  return (
    <article className={detailShellClassNames.row}>
      <div className={detailShellClassNames.rowMain}>
        <strong>{appeal.id}</strong>
        <span>{`牌桌：${appeal.tableId}`}</span>
        <span>{`提交人：${submitterLabel}`}</span>
        <span>{`提交时间：${formatDateTime(appeal.createdAt)}`}</span>
        <span>{appeal.description || '未填写申诉说明。'}</span>
      </div>
      <div className={detailShellClassNames.rowSide}>
        <StatusPill tone={getAppealStatusTone(appeal.status)}>
          {appealStatusText}
        </StatusPill>
        <span>{`处理人：${assigneeLabel}`}</span>
        <span>{`处理结果：${appeal.resolution ?? appeal.verdict ?? '待处理'}`}</span>
        <span>{`最近更新：${formatDateTime(appeal.updatedAt ?? appeal.createdAt)}`}</span>
        {appeal.status !== 'Resolved' && appeal.status !== 'Rejected' ? (
          <div className={detailShellClassNames.actionRow}>
            {canManageAppeals && !isAppealClaimed ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAssignAppeal(appeal)}
                disabled={submittingAppealId === appeal.id}
              >
                认领到我
              </Button>
            ) : null}
            {canManageAppeals ? (
              <Button
                size="sm"
                onClick={() => onOpenAppealAction(appeal, 'Resolve')}
                disabled={submittingAppealId === appeal.id || !isAppealClaimed}
              >
                解决
              </Button>
            ) : null}
            {canManageAppeals ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onOpenAppealAction(appeal, 'Reject')}
                disabled={submittingAppealId === appeal.id || !isAppealClaimed}
              >
                驳回
              </Button>
            ) : null}
            {canManageAppeals && appeal.status !== 'Escalated' ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onOpenAppealAction(appeal, 'Escalate')}
                disabled={submittingAppealId === appeal.id}
              >
                升级
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}
