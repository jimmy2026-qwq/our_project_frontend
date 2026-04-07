import { operationsApi } from '@/api/operations';
import { DataPanel, InfoSummaryCard, InfoSummaryGrid, ListRow, MetadataCard, MetricCard, MetricGrid } from '@/components/shared/data-display';
import { WorkbenchBacklogPanel } from '@/components/shared/domain';
import { SectionIntro } from '@/components/shared/layout';
import { InfoCard, SectionCallout, Separator } from '@/components/ui';
import { featureModules } from '@/config/modules';
import { roleCapabilities } from '@/config/roles';
import { mockClubs, mockDashboards, mockLeaderboard, mockSchedules } from '@/mocks/overview';

const heroCards = [
  {
    label: 'Migration State',
    title: 'React shell is established',
    detail:
      'The frontend has already crossed the largest migration boundary: it now boots from src/main.tsx and runs as a routed React app.',
  },
  {
    label: 'Primary Doc',
    title: '/doc/frontend-template-migration-plan.md',
    detail:
      'Tracks what is already aligned with the template architecture, what still differs, and which cleanup tasks remain.',
  },
  {
    label: 'Contracts',
    title: '/doc/FRONTEND_INTERFACE_CONTRACTS.md',
    detail:
      'Defines the backend response shapes the routed pages should keep consuming while the frontend continues to consolidate.',
  },
  {
    label: 'Current Theme',
    title: 'API first, mock safe',
    detail:
      'The active routes prefer live backend data first and fall back to mock-backed views when contracts are unavailable.',
  },
];

const foundationLayers = [
  {
    title: 'React App Shell',
    body:
      'The runtime architecture is no longer prototype-only. The app now mounts from src/main.tsx, uses createBrowserRouter, and renders route pages inside AppShell.',
  },
  {
    title: 'Route-Oriented Pages',
    body:
      'Blueprint home, public hall, member hub, tournament operations, and public detail views now exist as routed pages instead of being stitched together by manual mount logic.',
  },
  {
    title: 'Feature-Level Organization',
    body:
      'Business logic is split into features/blueprint, features/public-hall, features/member-hub, and features/tournament-ops rather than concentrating everything in a few giant modules.',
  },
  {
    title: 'Shared Business Layer',
    body:
      'The typed domain models, modular API layer, query helpers, and club-application logic remain one of the strongest migration assets and still anchor the current frontend.',
  },
];

const migrationTracks = [
  {
    title: 'Already in place',
    detail: 'React root, routed pages, feature folders, shared ui primitives, shared domain shells, and root-level notice/dialog providers are all now part of the app.',
  },
  {
    title: 'Still being aligned',
    detail: 'The largest remaining gaps are styling-system consistency, provider breadth, richer state infrastructure, and broader toolchain/template ecosystem alignment.',
  },
  {
    title: 'What must not regress',
    detail: 'Normalization inside the domain-specific API modules remains migration-critical because backend payloads still do not map cleanly to the current frontend view models.',
  },
  {
    title: 'Why this blueprint exists',
    detail: 'The page keeps the migrated architecture, active contracts, and route responsibilities visible in one place so cleanup work stays grounded in the current codebase.',
  },
];

const workbenchSteps = [
  {
    title: 'Blueprint Home',
    detail: 'Explains the migrated architecture, keeps contract touchpoints visible, and hosts the current home application workbench.',
  },
  {
    title: 'Public Hall',
    detail: 'Reads public schedules, club data, and leaderboard data from routed pages with public detail views behind them.',
  },
  {
    title: 'Member Hub',
    detail: 'Keeps operator switching, player and club dashboards, and the club-application inbox inside a feature-owned workspace.',
  },
  {
    title: 'Tournament Ops',
    detail: 'Covers tables, records, and appeals while preserving the same backend-first plus mock-fallback operating pattern.',
  },
];

const sampleRequests = [
  {
    title: 'Session bootstrap',
    description: 'Session state is expected to come from a stable frontend-facing session contract rather than ad hoc local assumptions.',
    path: '/session?operatorId=player-123',
  },
  {
    title: 'Current player context',
    description: 'The home application and member-facing flows still depend on loading the canonical player aggregate for the active operator.',
    path: '/players/me?operatorId=player-123',
  },
  {
    title: 'Club application inbox',
    description: 'Member hub and review flows depend on the stable club application inbox shape with operator scope and pending-state filters.',
    path: 'GET /clubs/:clubId/applications?operatorId=:clubAdminId&status=Pending&limit=20',
  },
  {
    title: 'Public club detail',
    description: 'Public club detail is contract-backed and includes lineup, treasury, relation, and application-policy information for public display.',
    path: '/public/clubs/:clubId',
  },
  {
    title: 'Tournament stage directory',
    description: 'Tournament operations still needs this shape to replace hard-coded stage selectors with a backend-driven directory.',
    path: '/tournaments/:id/stages',
  },
  {
    title: 'Tournament table queue',
    description: 'Tables remain one of the most valuable operational entry points in the current tournament workbench.',
    path: operationsApi.buildTournamentTablesPath('tournament-123', 'stage-demo-swiss', {
      status: 'WaitingPreparation',
      limit: 8,
    }),
  },
];

const contractChecklist = [
  {
    title: 'Stable contract posture',
    detail:
      'The interface contracts document focuses on stable backend response shapes the next frontend iterations should preserve instead of describing an older prototype shell.',
  },
  {
    title: 'Active member write flow',
    detail:
      'The highest-value current write flow still centers on club application submit, withdraw, and admin review rather than broad CRUD coverage.',
  },
  {
    title: 'Public detail shape',
    detail:
      'Public club and tournament pages are expected to read richer detail responses than the summary lists, so detail normalization remains important.',
  },
  {
    title: 'Operations backlog',
    detail:
      'Tournament operations still needs more backend-driven context loading, but the page already mirrors the queue shapes for tables, records, and appeals.',
  },
];

const routeDependencyBacklog = [
  {
    id: 'ops-tournament-directory',
    title: 'Tournament directory contract',
    detail: 'Tournament operations still needs GET /tournaments so the workbench can stop relying on hard-coded top-level context.',
  },
  {
    id: 'ops-stage-directory',
    title: 'Stage directory contract',
    detail: 'GET /tournaments/:id/stages is still the main missing dependency for replacing static stage selectors with backend-driven context.',
  },
  {
    id: 'operator-permissions',
    title: 'Operator permission scope',
    detail: 'A stable operator-permissions contract would let the routed workbenches express capability scope without treating every route as globally writable.',
  },
];

function formatLocalTime(value: string) {
  return new Intl.DateTimeFormat('zh-CN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function BlueprintHeroSection() {
  return (
    <section className="hero blueprint-hero">
      <div className="hero__copy">
        <p className="eyebrow">RiichiNexus Frontend Blueprint</p>
        <h1>Describe the app as it exists now, not as the earlier prototype described it</h1>
        <p className="hero__summary">
          This blueprint is now grounded in the current docs under <code>/doc</code>. It summarizes the routed React
          shell, the active feature slices, the migration status relative to the template frontend, and the backend
          contracts that still shape the user-facing workbenches.
        </p>
        <div className="blueprint-hero__chips">
          <span className="portal-inline-badge">React Router</span>
          <span className="portal-inline-badge">Feature Slices</span>
          <span className="portal-inline-badge">Shared UI</span>
          <span className="portal-inline-badge">Contract Driven</span>
        </div>
      </div>
      <InfoCard className="hero__panel blueprint-hero__panel" title="Current Blueprint Focus">
        <ol className="priority-list">
          <li>Keep the root blueprint aligned with the migration plan instead of the older prototype README.</li>
          <li>Show which route surfaces are already real product pages and which still need deeper infrastructure.</li>
          <li>Keep active backend contracts visible so UI cleanup does not drift away from the data model.</li>
        </ol>
      </InfoCard>
      <InfoSummaryGrid className="blueprint-highlights grid-cols-1 md:grid-cols-2 xl:grid-cols-4 xl:[grid-column:1/-1]">
        {heroCards.map((item) => (
          <InfoSummaryCard
            key={item.title}
            className="blueprint-highlight-card min-h-full"
            label={item.label}
            title={item.title}
            detail={item.detail}
          />
        ))}
      </InfoSummaryGrid>
    </section>
  );
}

export function BlueprintArchitectureSection() {
  return (
    <section className="section">
      <SectionIntro
        eyebrow="1. Architecture"
        title="What the migration plan says is already true in this frontend"
        description="The major runtime migration has already happened. The frontend is now a routed React application with feature-level ownership, a reusable UI layer, and preserved typed business logic. The remaining work is mostly alignment and consolidation rather than another architectural reset."
      />
      <div className="architecture-grid">
        {foundationLayers.map((item) => (
          <article key={item.title} className="card stack-card">
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </article>
        ))}
      </div>
      <div className="module-grid">
        {featureModules.map((module) => (
          <MetadataCard
            key={module.id}
            className="module-card"
            title={module.title}
            subtitle={module.primaryRoles.join(' / ')}
            summary={module.summary}
            details={
              <>
                <Separator />
                <p><strong>Key entities</strong> {module.entities.join(' / ')}</p>
                <p><strong>Main entry points</strong> {module.routes.join(' | ')}</p>
              </>
            }
          />
        ))}
      </div>
      <InfoSummaryGrid className="workbench-steps grid-cols-1 md:grid-cols-2 xl:grid-cols-4 xl:[grid-column:1/-1]">
        {migrationTracks.map((item, index) => (
          <InfoSummaryCard
            key={item.title}
            className="workbench-step-card min-h-full"
            label={`0${index + 1}`}
            title={item.title}
            detail={item.detail}
            titleAs="h3"
          />
        ))}
      </InfoSummaryGrid>
    </section>
  );
}

export function BlueprintRoleMatrixSection() {
  return (
    <section className="section">
      <SectionIntro
        eyebrow="2. Roles & Surfaces"
        title="How the current routes still map to user roles"
        description="The docs and feature modules already imply a clear division of responsibility even though route guards and richer session infrastructure are still evolving."
      />
      <div className="role-grid">
        {roleCapabilities.map((capability) => (
          <MetadataCard
            key={capability.role}
            className="role-card"
            title={capability.role}
            subtitle={capability.landingRoute}
            summary={capability.description}
            details={
              <>
                <Separator />
                <p><strong>Can read</strong> {capability.canRead.join(' / ') || 'None'}</p>
                <p><strong>Can write</strong> {capability.canWrite.join(' / ') || 'None'}</p>
              </>
            }
          />
        ))}
      </div>
    </section>
  );
}

export function BlueprintWorkbenchSection() {
  return (
    <section className="section">
      <SectionIntro
        eyebrow="3. Routed Experience"
        title="How the current frontend workbench is stitched together"
        description="These route surfaces are already present in the app. The blueprint page keeps them connected as one product story so architecture, docs, and user-facing flows stay aligned during cleanup."
      />
      <InfoSummaryGrid className="workbench-steps grid-cols-1 md:grid-cols-2 xl:grid-cols-4 xl:[grid-column:1/-1]">
        {workbenchSteps.map((item, index) => (
          <InfoSummaryCard
            key={item.title}
            className="workbench-step-card min-h-full"
            label={`0${index + 1}`}
            title={item.title}
            detail={item.detail}
            titleAs="h3"
          />
        ))}
      </InfoSummaryGrid>
      <div className="workbench-grid">
        <DataPanel title="Public schedule snapshot">
          <ul className="list">
            {mockSchedules.map((item) => (
              <ListRow
                key={`${item.tournamentId}-${item.stageId}`}
                main={
                  <>
                    <strong>{item.tournamentName}</strong>
                    <span>{item.stageName}</span>
                  </>
                }
                aside={
                  <>
                    <span>{item.tournamentStatus} / {item.stageStatus}</span>
                    <span>{formatLocalTime(item.scheduledAt)}</span>
                  </>
                }
              />
            ))}
          </ul>
        </DataPanel>
        <DataPanel title="Leaderboard snapshot">
          <ul className="list">
            {mockLeaderboard.map((item) => (
              <ListRow
                key={item.playerId}
                main={
                  <>
                    <strong>{`#${item.rank} ${item.nickname}`}</strong>
                    <span>{item.clubName}</span>
                  </>
                }
                aside={
                  <>
                    <span>{`ELO ${item.elo}`}</span>
                    <span>{item.status}</span>
                  </>
                }
              />
            ))}
          </ul>
        </DataPanel>
        <DataPanel title="Club directory snapshot">
          <ul className="list">
            {mockClubs.map((club) => (
              <ListRow
                key={club.id}
                main={
                  <>
                    <strong>{club.name}</strong>
                    <span>{`${club.memberCount} members`}</span>
                  </>
                }
                aside={
                  <>
                    <span>{`Power ${club.powerRating}`}</span>
                    <span>{club.relations.join(', ') || 'Neutral'}</span>
                  </>
                }
              />
            ))}
          </ul>
        </DataPanel>
        <DataPanel title="Dashboard preview">
          {mockDashboards.map((board) => (
            <article key={board.ownerId} className="card dashboard-card">
              <h3>{board.ownerType === 'player' ? 'Player Dashboard' : 'Club Dashboard'}</h3>
              <p>{board.headline}</p>
              <MetricGrid>
                {board.metrics.map((metric) => (
                  <MetricCard key={metric.label} label={metric.label} value={metric.value} accent={metric.accent ?? 'default'} />
                ))}
              </MetricGrid>
            </article>
          ))}
        </DataPanel>
      </div>
    </section>
  );
}

export function BlueprintApiReferenceSection() {
  return (
    <section className="section">
      <SectionIntro
        eyebrow="4. Contract Mapping"
        title="Which backend contracts still shape the visible frontend"
        description="This page now highlights the interfaces that matter to the current routed experience: session and player context, club application review, public detail views, and tournament operations queue data."
      />
      <div className="api-list">
        {sampleRequests.map((sample) => (
          <article key={sample.title} className="card api-card">
            <h3>{sample.title}</h3>
            <p>{sample.description}</p>
            <code>{sample.path}</code>
          </article>
        ))}
      </div>
      <div className="api-list">
        {contractChecklist.map((item) => (
          <SectionCallout key={item.title} className="api-card api-card--note" title={item.title} description={item.detail} />
        ))}
      </div>
      <WorkbenchBacklogPanel
        title="Current route dependency backlog"
        description="These are the main backend-facing gaps still visible from the top-level blueprint while the routed workbenches continue consolidating."
        items={routeDependencyBacklog}
      />
    </section>
  );
}
