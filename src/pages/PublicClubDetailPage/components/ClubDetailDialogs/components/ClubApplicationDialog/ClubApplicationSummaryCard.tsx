import { useMemo } from 'react';

import { StatusPill } from '@/components/ui';
import type { ClubApplication } from '@/pages/objects/ClubApplicationViews';

import { formatDateTime } from '../../../../functions/getClubApplicationHelpers';

function getApplicationTone(status?: ClubApplication['status']) {
  if (status === 'Approved') {
    return 'success' as const;
  }

  if (status === 'Rejected' || status === 'Withdrawn') {
    return 'danger' as const;
  }

  return 'warning' as const;
}

function getApplicationStatusLabel(status?: ClubApplication['status']) {
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
      return status ?? '--';
  }
}

export function ClubApplicationSummaryCard({
  application,
}: {
  application: ClubApplication;
}) {
  const summaryItems = useMemo(
    () => [
      {
        label: '状态',
        value: getApplicationStatusLabel(application.status),
      },
      { label: '申请编号', value: application.id },
      {
        label: '提交时间',
        value: formatDateTime(application.createdAt),
      },
      { label: '备注', value: application.message || '--' },
    ],
    [application],
  );

  return (
    <div className="grid gap-3 rounded-[22px] border border-[rgba(176,223,229,0.14)] bg-[rgba(255,255,255,0.03)] p-4">
      <div className="flex items-center justify-between gap-3">
        <strong className="text-[#f2f7fb]">当前申请</strong>
        <StatusPill tone={getApplicationTone(application.status)}>
          {getApplicationStatusLabel(application.status)}
        </StatusPill>
      </div>
      <dl className="m-0 grid gap-2">
        {summaryItems.map((item) => (
          <div key={item.label} className="grid gap-1">
            <dt className="text-[0.82rem] text-[#9ab0c1]">{item.label}</dt>
            <dd className="m-0 text-[#f2f7fb]">{item.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
