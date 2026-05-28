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
          eyebrow="Member Hub"
          title="Member Workspace"
          description="This workspace now depends on live backend operator and dashboard data."
        />
        <EmptyState>
          No member hub operator context is available for the current session.
        </EmptyState>
      </MemberHubPageShell>
    );
  }

  return (
    <MemberHubPageShell>
      <SectionIntro
        eyebrow="Member Hub"
        title="Member Workspace"
        description="This page now prefers backend-aligned operator context so the approval flow can follow the seeded club admin identity."
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
            title="Player Dashboard"
            path={`/dashboards/players/${state.playerId}?operatorId=${state.operatorId}`}
            loadState={playerDashboardState}
          />
        ) : (
          <DashboardPlaceholder
            title="Player Dashboard"
            path={`/dashboards/players/${state.playerId}?operatorId=${state.operatorId}`}
            loadState={playerDashboardState}
            roleNote="The player dashboard is still using a placeholder path whenever the API does not return a live dashboard yet."
          />
        )}

        {activeOperator.role === 'ClubAdmin' &&
        clubDashboardState.source === 'api' &&
        clubDashboardState.dashboard ? (
          <DashboardPanel
            title="Club Dashboard"
            path={`/dashboards/clubs/${state.clubId}?operatorId=${state.operatorId}`}
            loadState={clubDashboardState}
          />
        ) : (
          <DashboardPlaceholder
            title="Club Dashboard"
            path={`/dashboards/clubs/${state.clubId}?operatorId=${state.operatorId}`}
            loadState={clubDashboardState}
            roleNote={
              activeOperator.role === 'ClubAdmin'
                ? 'The club dashboard remains in placeholder mode until the API returns a live admin dashboard.'
                : 'This dashboard stays hidden from non-admin operators and remains an explanatory placeholder.'
            }
          />
        )}
      </div>
    </MemberHubPageShell>
  );
}
