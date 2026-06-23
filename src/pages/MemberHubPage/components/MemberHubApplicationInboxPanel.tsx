import { Role, ClubApplicationReviewDecisions, ClubApplicationStatuses, type ClubApplicationReviewDecision } from '@/objects';
import { ActionButton, DataPanel, EmptyState } from '@/components/ui';
import { ClubApplicationList } from '@/components/ui';

import { formatMemberHubDateTime } from '../functions/formatMemberHubDateTime';
import { getActiveOperator } from '../functions/getMemberHubOperator';
import { ApplicationInboxState } from '../objects/state/ApplicationInboxState';
import { MemberHubOperatorDirectory } from '../objects/operator/MemberHubOperatorDirectory';
import { MemberHubState } from '../objects/state/MemberHubState';

interface ApplicationInboxPanelProps {
  directory: MemberHubOperatorDirectory;
  state: MemberHubState;
  inboxState: ApplicationInboxState;
  onReview: (
    applicationId: string,
    decision: ClubApplicationReviewDecision,
  ) => void;
}

/** 成员中心中展示俱乐部入会申请收件箱的面板。 */
export function ApplicationInboxPanel({
  directory,
  state,
  inboxState,
  onReview,
}: ApplicationInboxPanelProps) {
  const activeOperator = getActiveOperator(directory, state.operatorId);

  if (activeOperator.role !== Role.ClubAdmin) {
    return (
      <DataPanel
        title="俱乐部申请收件箱"
        description="只有俱乐部管理员可以审核待处理的入会申请。"
      >
        <EmptyState>
          当前操作身份不是俱乐部管理员，暂时没有可审核的申请。
        </EmptyState>
      </DataPanel>
    );
  }

  const pendingCount = inboxState.items.filter(
    (item) => item.status === ClubApplicationStatuses.Pending,
  ).length;

  return (
    <DataPanel
      title="俱乐部申请收件箱"
      description="优先读取后端申请队列；接口不可用时保留本地占位。"
      warning={inboxState.warning}
      badgeLabel={`待处理 ${pendingCount}`}
    >
      <ClubApplicationList
        items={inboxState.items.map((item) => ({
          id: item.applicationId,
          title: item.applicant.displayName,
          message: item.message,
          submittedAt: formatMemberHubDateTime(item.submittedAt),
          status: item.status,
          meta: item.applicant.playerId,
          actions:
            item.canReview &&
            item.status === ClubApplicationStatuses.Pending ? (
              <>
                <ActionButton
                  onClick={() =>
                    onReview(
                      item.applicationId,
                      ClubApplicationReviewDecisions.Approve,
                    )
                  }
                >
                  通过
                </ActionButton>
                <ActionButton
                  onClick={() =>
                    onReview(
                      item.applicationId,
                      ClubApplicationReviewDecisions.Reject,
                    )
                  }
                >
                  拒绝
                </ActionButton>
              </>
            ) : null,
        }))}
        emptyText="当前没有待处理申请。"
      />
    </DataPanel>
  );
}
