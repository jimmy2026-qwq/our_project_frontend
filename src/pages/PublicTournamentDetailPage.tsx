import { useMemo, useReducer } from 'react';
import { useParams } from 'react-router-dom';

import {
  PublicDetailNotFound,
  PublicHallLoading,
  PublicTournamentDetailSection,
} from '@/features/public-hall/components';
import { buildFallbackTournamentStages } from '@/features/public-hall/data';
import { useTournamentDetail } from '@/features/public-hall/hooks';
import { TournamentOpsWorkbench } from '@/features/tournament-ops';
import { useAuth } from '@/hooks/useAuth';

export function PublicTournamentDetailPage() {
  const { tournamentId } = useParams();
  const { state, isLoading, refresh } = useTournamentDetail(tournamentId);
  const { session } = useAuth();
  const [opsReloadKey, reloadOpsWorkbench] = useReducer((value) => value + 1, 0);
  const canManageTournament =
    !!session?.user.roles.isRegisteredPlayer &&
    (session.user.roles.isSuperAdmin || session.user.roles.isTournamentAdmin);

  const profile = state?.item ?? null;
  const resolvedTournamentId = tournamentId ?? profile?.id ?? '';
  const stages = useMemo(
    () => (profile ? buildFallbackTournamentStages(resolvedTournamentId, profile) : []),
    [profile, resolvedTournamentId],
  );
  const fixedStages = useMemo(
    () =>
      stages.map((stage) => ({
        id: stage.stageId,
        name: stage.name,
      })),
    [stages],
  );

  if (isLoading || !state) {
    return (
      <PublicHallLoading
        eyebrow="赛事详情"
        title="正在加载赛事详情..."
        summary="正在同步赛事信息、阶段信息和管理视图。"
        progressLabel="赛事详情加载中"
        progressMessage="正在获取赛事详情、阶段配置和当前工作台数据。"
      />
    );
  }

  if (!profile) {
    return <PublicDetailNotFound title="未找到赛事" />;
  }

  return (
    <>
      <PublicTournamentDetailSection
        state={state}
        stages={stages}
        onScheduleSuccess={() => {
          refresh();
          reloadOpsWorkbench();
        }}
      />
      {canManageTournament ? (
        <section className="mt-6 grid gap-4">
          <div className="rounded-[var(--radius-xl)] bg-[color:var(--bg-elevated)] p-[24px]">
            <p className="eyebrow">管理员工作台</p>
            <h2 className="m-0 text-[1.5rem]">赛事管理员工作台</h2>
            <p className="mt-3 mb-0 text-[color:var(--muted-strong)]">
              在这里查看当前阶段的对局安排、牌谱记录、申诉信息，以及待开桌牌桌的准备状态。
            </p>
          </div>
          <TournamentOpsWorkbench
            fixedTournamentId={resolvedTournamentId}
            fixedTournamentName={profile.name}
            fixedStages={fixedStages}
            hideTournamentSelect
            reloadKey={opsReloadKey}
            canManageActions
          />
        </section>
      ) : null}
    </>
  );
}
