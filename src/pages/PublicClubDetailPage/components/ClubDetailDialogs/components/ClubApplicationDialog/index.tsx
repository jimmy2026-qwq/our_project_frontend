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
} from '@/components/ui';
import type { ClubApplication } from '@/pages/objects/ClubApplicationViews';
import type { ClubSummary } from '@/pages/objects/ClubSummary';

import { ClubApplicationSummaryCard } from './ClubApplicationSummaryCard';
import { useClubApplicationDialog } from './hooks/useClubApplicationDialog';

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogSurface>
          <DialogHeader className="border-b border-[rgba(176,223,229,0.14)] px-6 py-5">
            <DialogTitle className="text-[1.18rem] font-semibold text-[#f2f7fb]">
              申请加入 {club.name}
            </DialogTitle>
            <DialogDescription>
              你可以在这里查看当前申请状态、修改备注，并提交或撤回申请。
            </DialogDescription>
          </DialogHeader>

          <DialogBody className="px-6 py-5">
            {dialog.isLoading || !dialog.state ? (
              <p className="m-0 text-[#9ab0c1]">正在加载申请状态...</p>
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
                  <ClubApplicationSummaryCard
                    application={dialog.application}
                  />
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
              <ActionButton onClick={() => void dialog.refreshCurrentState()}>
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
