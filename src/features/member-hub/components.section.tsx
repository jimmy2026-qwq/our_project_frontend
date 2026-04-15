import { WorkbenchContextPanel } from '@/components/shared/domain';
import { EmptyState } from '@/components/shared/feedback';
import { SelectField } from '@/components/shared/forms';
import { SectionIntro } from '@/components/shared/layout';

import { getActiveOperator } from './data';
import { ApplicationInboxPanel, DashboardPanel, DashboardPlaceholder } from './components.panels';
import type { MemberHubPageSectionProps } from './components.types';

export function MemberHubPageSection({
  directory,
  state,
  playerPayload,
  clubPayload,
  inboxPayload,
  onReload,
  onChangeOperator,
  onChangePlayer,
  onChangeClub,
  onReview,
}: MemberHubPageSectionProps) {
  const activeOperator = getActiveOperator(directory, state.operatorId);
  const clubOptions = Object.values(directory.clubsById);
  const playerOptions = directory.items.map((operator) => ({
    value: operator.playerId,
    label: operator.label.split(' / ')[0] || operator.playerId,
  }));

  if (directory.items.length === 0) {
    return (
      <section className="section">
        <SectionIntro
          eyebrow="Member Hub"
          title="Member Workspace"
          description="This workspace now depends on live backend operator and dashboard data."
        />
        <EmptyState>No member hub operator context is available for the current session.</EmptyState>
      </section>
    );
  }

  return (
    <section className="section">
      <SectionIntro
        eyebrow="Member Hub"
        title="Member Workspace"
        description="This page now prefers backend-aligned operator context so the approval flow can follow the seeded club admin identity."
      />

      <WorkbenchContextPanel
        className="member-hub__controls text-[color:var(--muted-strong)]"
        title="Workspace Context"
        description="Switch operator scope and dashboard targets without pushing that state back into the page shell."
        onReload={onReload}
      >
        <SelectField label="Operator" value={state.operatorId} onChange={(event) => onChangeOperator(event.currentTarget.value)}>
          {directory.items.map((operator) => (
            <option key={operator.id} value={operator.id}>
              {operator.label}
            </option>
          ))}
        </SelectField>
        <SelectField label="Player dashboard" value={state.playerId} onChange={(event) => onChangePlayer(event.currentTarget.value)}>
          {playerOptions.map((player) => (
            <option key={player.value} value={player.value}>
              {player.label}
            </option>
          ))}
        </SelectField>
        <SelectField label="Managed club" value={state.clubId} onChange={(event) => onChangeClub(event.currentTarget.value)}>
          {clubOptions.map((club) => {
            const disabled =
              activeOperator.role !== 'ClubAdmin' || !activeOperator.managedClubIds.includes(club.id);

            return (
              <option key={club.id} value={club.id} disabled={disabled}>
                {club.name}
              </option>
            );
          })}
        </SelectField>
      </WorkbenchContextPanel>

      <div className="member-hub__grid grid gap-[18px] md:grid-cols-2">
        <ApplicationInboxPanel directory={directory} state={state} payload={inboxPayload} onReview={onReview} />
      </div>

      <div className="member-hub__grid grid gap-[18px] md:grid-cols-2">
        {playerPayload.source === 'api' && playerPayload.dashboard ? (
          <DashboardPanel
            title="Player Dashboard"
            path={`/dashboards/players/${state.playerId}?operatorId=${state.operatorId}`}
            payload={playerPayload}
          />
        ) : (
          <DashboardPlaceholder
            title="Player Dashboard"
            path={`/dashboards/players/${state.playerId}?operatorId=${state.operatorId}`}
            payload={playerPayload}
            roleNote="The player dashboard is still using a placeholder path whenever the API does not return a live dashboard yet."
          />
        )}

        {activeOperator.role === 'ClubAdmin' && clubPayload.source === 'api' && clubPayload.dashboard ? (
          <DashboardPanel
            title="Club Dashboard"
            path={`/dashboards/clubs/${state.clubId}?operatorId=${state.operatorId}`}
            payload={clubPayload}
          />
        ) : (
          <DashboardPlaceholder
            title="Club Dashboard"
            path={`/dashboards/clubs/${state.clubId}?operatorId=${state.operatorId}`}
            payload={clubPayload}
            roleNote={
              activeOperator.role === 'ClubAdmin'
                ? 'The club dashboard remains in placeholder mode until the API returns a live admin dashboard.'
                : 'This dashboard stays hidden from non-admin operators and remains an explanatory placeholder.'
            }
          />
        )}
      </div>
    </section>
  );
}
