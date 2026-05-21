import { useEffect, useMemo, useState } from 'react';

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
  type HomeClubApplicationState,
  formatDateTime,
  getFallbackPlayerName,
  loadPlayerContext,
  loadTrackedApplication,
  submitClubApplication,
  withdrawClubApplication,
} from '@/pages/PublicHall/objects/application-data';
import { useMutationNotice } from '@/app/feedback/useMutationNotice';
import { useNotice } from '@/app/feedback/useNotice';
import { useAuth } from '@/app/auth/useAuth';

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
  const { session } = useAuth();
  const { notifyMutationResult } = useMutationNotice();
  const { notifyWarning } = useNotice();
  const [state, setState] = useState<HomeClubApplicationState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (!session?.user.roles.isRegisteredPlayer) {
      setState(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    void (async () => {
      setIsLoading(true);
      const operatorId = session.user.operatorId ?? session.user.userId;
      const playerContext = await loadPlayerContext(
        operatorId,
        session.user.displayName,
      );
      const application = await loadTrackedApplication(operatorId, club.id);

      if (!cancelled) {
        onApplicationUpdated?.(application.application?.status ?? null);
        setState({
          operatorId,
          operatorDisplayName: session.user.displayName,
          clubId: club.id,
          message: '我想加入这个俱乐部，参与后续赛事安排。',
          withdrawNote: '计划有变动',
          clubs: {
            items: [club],
            source: 'api',
          },
          playerContext,
          application,
        });
        setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [club, onApplicationUpdated, session]);

  const selectedPlayerName =
    state?.playerContext.player?.displayName ??
    (state ? getFallbackPlayerName(state) : '');
  const application = state?.application.application ?? null;
  const isMember =
    state?.playerContext.player?.clubIds?.includes(club.id) ?? false;
  const canSubmit =
    !!state &&
    !isMember &&
    application?.status !== 'Pending' &&
    application?.status !== 'Approved';
  const canWithdraw = !!application && application.status === 'Pending';

  useEffect(() => {
    if (isMember) {
      onMembershipConfirmed?.();
    }
  }, [isMember, onMembershipConfirmed]);

  const summaryItems = useMemo(
    () =>
      application
        ? [
            {
              label: '状态',
              value: getApplicationStatusLabel(application.status),
            },
            { label: '申请编号', value: application.id },
            { label: '提交时间', value: formatDateTime(application.createdAt) },
            { label: '备注', value: application.message || '--' },
          ]
        : [],
    [application],
  );

  async function refreshCurrentState() {
    if (!state) {
      return;
    }

    setIsRefreshing(true);

    const [playerContext, applicationState] = await Promise.all([
      loadPlayerContext(state.operatorId, state.operatorDisplayName),
      loadTrackedApplication(
        state.operatorId,
        club.id,
        state.application.application?.id,
      ),
    ]);

    setState((current) =>
      current
        ? {
            ...current,
            playerContext,
            application: applicationState,
          }
        : current,
    );
    onApplicationUpdated?.(applicationState.application?.status ?? null);
    setIsRefreshing(false);
  }

  async function handleSubmit() {
    if (!state) {
      return;
    }

    try {
      const result = await submitClubApplication(state);
      setState((current) =>
        current
          ? {
              ...current,
              application: {
                application: result.application,
                source: result.source,
                warning: result.warning,
              },
            }
          : current,
      );
      notifyMutationResult(result, {
        successTitle: '申请已提交',
        successMessage: '俱乐部申请已经成功发送到后端。',
        fallbackTitle: '申请需要人工确认',
        fallbackMessage: '这次申请未能完全确认，请稍后刷新状态。',
      });
      onApplicationUpdated?.(result.application.status);
      onOpenChange(false);
    } catch (error) {
      notifyWarning(
        '申请提交失败',
        error instanceof Error ? error.message : '无法提交当前俱乐部申请。',
      );
    }
  }

  async function handleWithdraw() {
    if (!state) {
      return;
    }

    try {
      const result = await withdrawClubApplication(state);
      setState((current) =>
        current
          ? {
              ...current,
              application: {
                application: result.application,
                source: result.source,
                warning: result.warning,
              },
            }
          : current,
      );
      notifyMutationResult(result, {
        successTitle: '申请已撤回',
        successMessage: '撤回请求已经处理完成。',
        fallbackTitle: '撤回需要人工确认',
        fallbackMessage: '这次撤回未能完全确认，请稍后刷新状态。',
      });
      onApplicationUpdated?.(result.application.status);
    } catch (error) {
      notifyWarning(
        '撤回失败',
        error instanceof Error ? error.message : '无法撤回当前申请。',
      );
    }
  }

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
            {isLoading || !state ? (
              <p className="m-0 text-[#9ab0c1]">
                正在加载申请状态...
              </p>
            ) : (
              <div className="grid gap-5">
                <FieldGroup>
                  <TextInputField
                    label="申请人"
                    value={selectedPlayerName}
                    readOnly
                  />
                  <TextareaField
                    label="申请备注"
                    rows={4}
                    value={state.message}
                    onChange={(event) => {
                      const nextMessage = event.currentTarget.value;
                      setState((current) =>
                        current
                          ? { ...current, message: nextMessage }
                          : current,
                      );
                    }}
                  />
                </FieldGroup>

                {isMember ? (
                  <p className="m-0 rounded-[18px] border border-[rgba(176,223,229,0.14)] bg-[rgba(255,255,255,0.04)] px-4 py-3 text-[#9ab0c1]">
                    你已经是俱乐部成员。
                  </p>
                ) : null}

                {application ? (
                  <div className="grid gap-3 rounded-[22px] border border-[rgba(176,223,229,0.14)] bg-[rgba(255,255,255,0.03)] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <strong>当前申请</strong>
                      <StatusPill tone={getApplicationTone(application.status)}>
                        {getApplicationStatusLabel(application.status)}
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
              <ActionButton onClick={() => void refreshCurrentState()}>
                {isRefreshing ? '刷新中...' : '刷新状态'}
              </ActionButton>
              <ActionButton
                onClick={() => void handleSubmit()}
                disabled={!canSubmit}
              >
                提交申请
              </ActionButton>
              <ActionButton
                onClick={() => void handleWithdraw()}
                disabled={!canWithdraw}
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
