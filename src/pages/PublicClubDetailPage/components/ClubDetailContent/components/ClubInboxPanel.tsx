import { EmptyState, StatusPill } from '@/components/ui';
import { cx } from '@/components/ui/cx';
import type { ClubApplicationView } from '@/pages/objects/club';

import { formatDateTime } from '../../../functions/formatClubDetail';
import { clubPanelClassNames } from './styles';

function getApplicationStatusLabel(status: ClubApplicationView['status']) {
  switch (status) {
    case 'Pending':
      return '待处理';
    case 'Approved':
      return '已通过';
    case 'Rejected':
      return '已拒绝';
    case 'Withdrawn':
      return '已撤回';
    default:
      return status;
  }
}

export function ClubInboxPanel({
  isInboxLoading,
  applicationInbox,
  onReview,
}: {
  isInboxLoading: boolean;
  applicationInbox: ClubApplicationView[];
  onReview: (applicationId: string, decision: 'approve' | 'reject') => void;
}) {
  if (isInboxLoading) {
    return <p className="m-0 text-[#9ab0c1]">正在加载申请处理列表...</p>;
  }

  return (
    <section className={clubPanelClassNames.list}>
      <div className={clubPanelClassNames.listBody}>
        {applicationInbox.length > 0 ? (
          applicationInbox.map((item) => (
            <article
              key={item.applicationId}
              className={clubPanelClassNames.row}
            >
              <div className={clubPanelClassNames.rowMain}>
                <strong>{item.applicant.displayName}</strong>
                <span>{item.message || '未填写申请说明'}</span>
                <span>
                  {item.applicant.playerId || '--'} /{' '}
                  {formatDateTime(item.submittedAt)}
                </span>
              </div>
              <div className={clubPanelClassNames.rowSide}>
                <StatusPill
                  tone={
                    item.status === 'Pending'
                      ? 'warning'
                      : item.status === 'Approved'
                        ? 'success'
                        : 'danger'
                  }
                >
                  {getApplicationStatusLabel(item.status)}
                </StatusPill>
                {item.canReview && item.status === 'Pending' ? (
                  <>
                    <button
                      type="button"
                      className={clubPanelClassNames.action}
                      onClick={() => onReview(item.applicationId, 'approve')}
                    >
                      通过
                    </button>
                    <button
                      type="button"
                      className={cx(
                        clubPanelClassNames.action,
                        clubPanelClassNames.actionDanger,
                      )}
                      onClick={() => onReview(item.applicationId, 'reject')}
                    >
                      拒绝
                    </button>
                  </>
                ) : null}
              </div>
            </article>
          ))
        ) : (
          <EmptyState asListItem={false}>当前没有待处理的入会申请。</EmptyState>
        )}
      </div>
    </section>
  );
}
