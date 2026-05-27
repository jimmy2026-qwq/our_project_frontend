import { useMemo } from 'react';

import { FieldGroup, TextInputField, TextareaField } from '@/components/ui';
import { ActionButton } from '@/components/ui';
import {
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
} from '@/components/ui';
import type {
  ClubApplication,
  ClubSummary,
} from '@/pages/objects/club';
import {
  formatDateTime,
} from '../../../../objects/application-data';

import { useClubApplicationDialog } from './hooks/ClubApplicationDialog.hooks';

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

export function ClubApplicationDialog({
  club,
  open,
  onOpenChange,
  onMembershipConfirmed,
  onApplicationUpdated,
}: {
  club: ClubSummary;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMembershipConfirmed?: () => void;
  onApplicationUpdated?: (status: ClubApplication['status'] | null) => void;
}) {
  const dialog = useClubApplicationDialog({
    club,
    onOpenChange,
    onApplicationUpdated,
    onMembershipConfirmed,
  });

  const summaryItems = useMemo(
    () =>
      dialog.application
        ? [
            {
              label: '状态',
              value: getApplicationStatusLabel(dialog.application.status),
            },
            { label: '申请编号', value: dialog.application.id },
            {
              label: '提交时间',
              value: formatDateTime(dialog.application.createdAt),
            },
            { label: '备注', value: dialog.application.message || '--' },
          ]
        : [],
    [dialog.application],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogSurface>
          <DialogHeader className="border-b border-[rgba(176,223,229,0.14)] px-6 py-5">
            <DialogTitle>申请加入 {club.name}</DialogTitle>
            <DialogDescription>
              你可以在这里查看当前申请状态、修改备注，并提交或撤回申请。
            </DialogDescription>
          </DialogHeader>

          <DialogBody className="px-6 py-5">
            {dialog.isLoading || !dialog.state ? (
              <p className="m-0 text-[#9ab0c1]">
                正在加载申请状态...
              </p>
            ) : (
              <div className="grid gap-5">
                <FieldGroup>
                  <TextInputField
                    label="申请人"
                    value={dialog.selectedPlayerName}
                    readOnly
                  />
                  <TextareaField
                    label="申请备注"
                    rows={4}
                    value={dialog.state.message}
                    onChange={(event) => {
                      dialog.setMessage(event.currentTarget.value);
                    }}
                  />
                </FieldGroup>

                {dialog.isMember ? (
                  <p className="m-0 rounded-[18px] border border-[rgba(176,223,229,0.14)] bg-[rgba(255,255,255,0.04)] px-4 py-3 text-[#9ab0c1]">
                    你已经是俱乐部成员。
                  </p>
                ) : null}

                {dialog.application ? (
                  <div className="grid gap-3 rounded-[22px] border border-[rgba(176,223,229,0.14)] bg-[rgba(255,255,255,0.03)] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <strong>当前申请</strong>
                      <StatusPill
                        tone={getApplicationTone(dialog.application.status)}
                      >
                        {getApplicationStatusLabel(dialog.application.status)}
                      </StatusPill>
                    </div>
                    <dl className="m-0 grid gap-2">
                      {summaryItems.map((item) => (
                        <div key={item.label} className="grid gap-1">
                          <dt className="text-[0.82rem] text-[#9ab0c1]">
                            {item.label}
                          </dt>
                          <dd className="m-0 text-[#f2f7fb]">
                            {item.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ) : (
                  <p className="m-0 rounded-[18px] border border-dashed border-[rgba(176,223,229,0.14)] px-4 py-3 text-[#9ab0c1]">
                    当前还没有这家俱乐部的申请记录。
                  </p>
                )}
              </div>
            )}
          </DialogBody>

          <DialogFooter className="border-t border-[rgba(176,223,229,0.14)] px-6 py-5">
            <div className="grid w-full gap-3 sm:grid-cols-2">
              <ActionButton
                onClick={() => void dialog.refreshCurrentState()}
              >
                {dialog.isRefreshing ? '刷新中...' : '刷新状态'}
              </ActionButton>
              <ActionButton
                onClick={() => void dialog.handleSubmit()}
                disabled={!dialog.canSubmit}
              >
                提交申请
              </ActionButton>
              <ActionButton
                onClick={() => void dialog.handleWithdraw()}
                disabled={!dialog.canWithdraw}
              >
                撤回申请
              </ActionButton>
              <ActionButton
                variant="secondary"
                onClick={() => onOpenChange(false)}
              >
                关闭
              </ActionButton>
            </div>
          </DialogFooter>
        </DialogSurface>
      </DialogPortal>
    </Dialog>
  );
}
