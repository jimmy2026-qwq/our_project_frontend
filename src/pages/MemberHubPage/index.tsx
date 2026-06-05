import { EmptyState, SectionIntro } from '@/components/ui';

import { ApplicationInboxPanel } from './components/MemberHubApplicationInboxPanel';
import { MemberHubContextPanel } from './components/MemberHubContextPanel';
import {
  DashboardPanel,
  DashboardPlaceholder,
} from './components/MemberHubDashboardPanels';
import { MemberHubLoading } from './components/MemberHubLoading';
import { MemberHubPageShell } from './components/MemberHubPageShell';
import { useMemberHubPage } from './hooks/useMemberHubPage';

export function MemberHubPage() {
  const page = useMemberHubPage();

  if (
    page.isLoading ||
    !page.directory ||
    !page.activeOperator ||
    !page.playerDashboardState ||
    !page.clubDashboardState ||
    !page.applicationInboxState
  ) {
    return <MemberHubLoading />;
  }

  const {
    activeOperator,
    applicationInboxState,
    clubDashboardState,
    directory,
    playerDashboardState,
    state,
  } = page;

  if (directory.items.length === 0) {
    return (
      <MemberHubPageShell>
        <SectionIntro
          eyebrow="会员中心"
          title="会员工作台"
          description="当前会话没有可用的会员操作身份。"
        />
        <EmptyState>
          暂时没有可用的会员操作身份。
        </EmptyState>
      </MemberHubPageShell>
    );
  }

  return (
    <MemberHubPageShell>
      <SectionIntro
        eyebrow="会员中心"
        title="会员工作台"
        description="按当前登录身份查看申请、个人看板和可管理俱乐部看板。"
      />

      <MemberHubContextPanel
        directory={directory}
        state={state}
        activeOperator={activeOperator}
        onReload={page.onReload}
        onChangeOperator={page.actions.changeOperator}
        onChangePlayer={page.actions.changePlayer}
        onChangeClub={page.actions.changeClub}
      />

      <div className="grid gap-[18px] md:grid-cols-2">
        <ApplicationInboxPanel
          directory={directory}
          state={state}
          inboxState={applicationInboxState}
          onReview={page.actions.handleReview}
        />
      </div>

      <div className="grid gap-[18px] md:grid-cols-2">
        {playerDashboardState.source === 'api' &&
        playerDashboardState.dashboard ? (
          <DashboardPanel
            title="个人数据看板"
            path={`/dashboards/players/${state.playerId}?operatorId=${state.operatorId}`}
            loadState={playerDashboardState}
          />
        ) : (
          <DashboardPlaceholder
            title="个人数据看板"
            path={`/dashboards/players/${state.playerId}?operatorId=${state.operatorId}`}
            loadState={playerDashboardState}
            roleNote="接口暂时没有返回可用的个人看板数据。"
          />
        )}

        {activeOperator.role === 'ClubAdmin' &&
        clubDashboardState.source === 'api' &&
        clubDashboardState.dashboard ? (
          <DashboardPanel
            title="俱乐部数据看板"
            path={`/dashboards/clubs/${state.clubId}?operatorId=${state.operatorId}`}
            loadState={clubDashboardState}
          />
        ) : (
          <DashboardPlaceholder
            title="俱乐部数据看板"
            path={`/dashboards/clubs/${state.clubId}?operatorId=${state.operatorId}`}
            loadState={clubDashboardState}
            roleNote={
              activeOperator.role === 'ClubAdmin'
                ? '接口暂时没有返回可用的俱乐部看板数据。'
                : '只有俱乐部管理员可以查看俱乐部看板。'
            }
          />
        )}
      </div>
    </MemberHubPageShell>
  );
}
