import {
  ActionButton,
  ClubApplicationList,
  DataPanel,
  EmptyState,
} from '@/components/ui';

import { formatMemberHubDateTime } from '../functions/formatMemberHubDateTime';
import { getActiveOperator } from '../functions/getMemberHubOperator';
import type {
  ApplicationInboxState,
  MemberHubOperatorDirectory,
  MemberHubState,
} from '../objects/MemberHub.types';

interface ApplicationInboxPanelProps {
  directory: MemberHubOperatorDirectory;
  state: MemberHubState;
  inboxState: ApplicationInboxState;
  onReview: (applicationId: string, decision: 'approve' | 'reject') => void;
}

export function ApplicationInboxPanel({
  directory,
  state,
  inboxState,
  onReview,
}: ApplicationInboxPanelProps) {
  const activeOperator = getActiveOperator(directory, state.operatorId);

  if (activeOperator.role !== 'ClubAdmin') {
    return (
      <DataPanel
        title="Club Application Inbox"
        description="Only club admins can review pending membership applications."
      >
        <EmptyState>
          The current operator is not a club admin, so this panel stays in an
          explanatory state.
        </EmptyState>
      </DataPanel>
    );
  }

  const pendingCount = inboxState.items.filter(
    (item) => item.status === 'Pending',
  ).length;

  return (
    <DataPanel
      title="Club Application Inbox"
      description="Prefer the backend queue first, then fall back to the local inbox bridge if the API is unavailable."
      source={inboxState.source}
      warning={inboxState.warning}
      badgeLabel={`Pending ${pendingCount}`}
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
            item.canReview && item.status === 'Pending' ? (
              <>
                <ActionButton
                  onClick={() => onReview(item.applicationId, 'approve')}
                >
                  Approve
                </ActionButton>
                <ActionButton
                  onClick={() => onReview(item.applicationId, 'reject')}
                >
                  Reject
                </ActionButton>
              </>
            ) : null,
        }))}
        emptyText="No pending applications are available right now."
      />
    </DataPanel>
  );
}
