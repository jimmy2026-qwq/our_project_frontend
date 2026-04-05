import { useEffect, useMemo, useState } from 'react';

import { useAuth } from '@/hooks/useAuth';
import { useMutationNotice, useNotice } from '@/hooks';
import {
  type HomeClubApplicationState,
  formatDateTime,
  getFallbackPlayerName,
  loadPlayerContext,
  loadTrackedApplication,
  submitClubApplication,
  withdrawClubApplication,
} from '@/features/blueprint/application-data';
import { ActionButton } from '@/components/shared/layout';
import { FieldGroup, TextInputField, TextareaField } from '@/components/shared/forms';
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
import type { ClubSummary } from '@/domain/models';

function getApplicationTone(status?: HomeClubApplicationState['application']['application'] extends infer T
  ? T extends { status: infer S }
    ? S
    : never
  : never) {
  if (status === 'Approved') {
    return 'success' as const;
  }

  if (status === 'Rejected' || status === 'Withdrawn') {
    return 'danger' as const;
  }

  return 'warning' as const;
}

export function ClubApplicationDialog({
  club,
  open,
  onOpenChange,
}: {
  club: ClubSummary;
  open: boolean;
  onOpenChange: (open: boolean) => void;
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
      const playerContext = await loadPlayerContext(operatorId, session.user.displayName);
      const application = await loadTrackedApplication(operatorId, club.id);

      if (!cancelled) {
        setState({
          operatorId,
          operatorDisplayName: session.user.displayName,
          clubId: club.id,
          message: 'I would like to join next split.',
          withdrawNote: 'schedule changed',
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
  }, [club, session]);

  const selectedPlayerName = state?.playerContext.player?.displayName ?? (state ? getFallbackPlayerName(state) : '');
  const application = state?.application.application ?? null;
  const isMember = state?.playerContext.player?.clubIds?.includes(club.id) ?? false;
  const canSubmit = !!state && !isMember && application?.status !== 'Pending' && application?.status !== 'Approved';
  const canWithdraw = !!application && application.status === 'Pending';

  const summaryItems = useMemo(
    () =>
      application
        ? [
            { label: 'Status', value: application.status },
            { label: 'Application id', value: application.id },
            { label: 'Submitted at', value: formatDateTime(application.createdAt) },
            { label: 'Note', value: application.message },
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
      loadTrackedApplication(state.operatorId, club.id, state.application.application?.id),
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
        successTitle: 'Club application submitted',
        successMessage: 'The request was sent to the backend successfully.',
        fallbackTitle: 'Club application submitted with fallback',
        fallbackMessage: 'The request used the local fallback flow.',
      });
    } catch (error) {
      notifyWarning('Club application failed', error instanceof Error ? error.message : '提交申请失败，请稍后再试。');
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
        successTitle: 'Application withdrawn',
        successMessage: 'The withdraw request completed successfully.',
        fallbackTitle: 'Application withdrawn with fallback',
        fallbackMessage: 'The withdraw flow used the local fallback path.',
      });
    } catch (error) {
      notifyWarning('Withdraw failed', error instanceof Error ? error.message : '撤回申请失败，请稍后再试。');
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogSurface>
          <DialogHeader className="border-b border-[color:var(--line)] px-6 py-5">
            <DialogTitle>申请加入 {club.name}</DialogTitle>
            <DialogDescription>
              你可以直接在俱乐部详情页提交入会申请，不需要再跳回项目蓝图页面。
            </DialogDescription>
          </DialogHeader>

          <DialogBody className="px-6 py-5">
            {isLoading || !state ? (
              <p className="m-0 text-[color:var(--muted)]">正在加载你的玩家身份信息...</p>
            ) : (
              <div className="grid gap-5">
                <FieldGroup className="guest-flow__form">
                  <TextInputField label="当前申请人" value={selectedPlayerName} readOnly />
                  <TextInputField label="当前 operatorId" value={state.operatorId} readOnly />
                  <TextareaField
                    label="申请说明"
                    rows={4}
                    value={state.message}
                    onChange={(event) =>
                      setState((current) => (current ? { ...current, message: event.currentTarget.value } : current))
                    }
                  />
                </FieldGroup>

                {isMember ? (
                  <p className="m-0 rounded-[18px] border border-[color:var(--line)] bg-[rgba(255,255,255,0.04)] px-4 py-3 text-[color:var(--muted)]">
                    你已经是这个俱乐部的成员了，不需要重复申请。
                  </p>
                ) : null}

                {application ? (
                  <div className="grid gap-3 rounded-[22px] border border-[color:var(--line)] bg-[rgba(255,255,255,0.03)] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <strong>当前申请</strong>
                      <StatusPill tone={getApplicationTone(application.status)}>{application.status}</StatusPill>
                    </div>
                    <dl className="m-0 grid gap-2">
                      {summaryItems.map((item) => (
                        <div key={item.label} className="grid gap-1">
                          <dt className="text-[0.82rem] text-[color:var(--muted)]">{item.label}</dt>
                          <dd className="m-0 text-[color:var(--text)]">{item.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ) : (
                  <p className="m-0 rounded-[18px] border border-dashed border-[color:var(--line)] px-4 py-3 text-[color:var(--muted)]">
                    你目前还没有向这个俱乐部提交申请。
                  </p>
                )}
              </div>
            )}
          </DialogBody>

          <DialogFooter className="border-t border-[color:var(--line)] px-6 py-5">
            <div className="grid w-full gap-3 sm:grid-cols-2">
              <ActionButton onClick={() => void refreshCurrentState()}>
                {isRefreshing ? '刷新中...' : '刷新当前状态'}
              </ActionButton>
              <ActionButton onClick={() => void handleSubmit()} disabled={!canSubmit}>
                我想申请加入这个俱乐部
              </ActionButton>
              <ActionButton onClick={() => void handleWithdraw()} disabled={!canWithdraw}>
                撤回当前申请
              </ActionButton>
              <ActionButton variant="secondary" onClick={() => onOpenChange(false)}>
                关闭
              </ActionButton>
            </div>
          </DialogFooter>
        </DialogSurface>
      </DialogPortal>
    </Dialog>
  );
}
