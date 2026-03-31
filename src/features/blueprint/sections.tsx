import { apiClient } from '@/api/client';
import { DataPanel, ListRow, MetricCard, MetricGrid } from '@/components/shared/data-display';
import { SectionIntro } from '@/components/shared/layout';
import { featureModules } from '@/config/modules';
import { roleCapabilities } from '@/config/roles';
import { mockClubs, mockDashboards, mockLeaderboard, mockSchedules } from '@/mocks/overview';

const heroCards = [
  {
    label: 'Current Entry',
    title: '/',
    detail: 'Project blueprint home now runs inside the React Router shell and summarizes the current frontend architecture.',
  },
  {
    label: 'Primary Doc',
    title: '/doc/README.md',
    detail: 'Describes the current route structure, feature layering, data strategy, and next migration work.',
  },
  {
    label: 'Contracts',
    title: '/doc/FRONTEND_INTERFACE_CONTRACTS.md',
    detail: 'Keeps the stable backend contracts visible while the frontend continues migrating into template mode.',
  },
  {
    label: 'Migration Plan',
    title: '/doc/frontend-template-migration-plan.md',
    detail: 'Tracks completed migration phases, current cleanup state, and the next steps toward the template architecture.',
  },
];

const foundationLayers = [
  {
    title: 'App Shell',
    body: 'The app now boots from src/main.tsx and uses React Router to host blueprint, public hall, member hub, and tournament operations.',
  },
  {
    title: 'Feature Slices',
    body: 'Main business areas now live under feature folders such as features/public-hall, features/blueprint, features/member-hub, and features/tournament-ops.',
  },
  {
    title: 'API Client',
    body: 'The shared client still owns URL construction, fetch handling, and payload normalization. That normalization remains one of the most important migration assets.',
  },
  {
    title: 'Mock Fallback',
    body: 'Pages still prefer live backend data first and fall back to mock data when needed, keeping the app testable while contracts continue to evolve.',
  },
];

const workbenchSteps = [
  {
    title: 'Blueprint Home',
    detail: 'Summarizes architecture and hosts the home club-application workbench.',
  },
  {
    title: 'Public Hall',
    detail: 'Loads public schedules, clubs, and leaderboard views, then routes into detail pages.',
  },
  {
    title: 'Member Hub',
    detail: 'Loads player and club dashboards plus the club-application inbox.',
  },
  {
    title: 'Tournament Ops',
    detail: 'Focuses on tables, records, and appeals inside the operational workbench.',
  },
];

const sampleRequests = [
  {
    title: 'Public schedules',
    description: 'The public hall homepage reads public schedules directly instead of relying on the old demo summary endpoint.',
    path: '/public/schedules?tournamentStatus=InProgress&stageStatus=Active',
  },
  {
    title: 'Public clubs',
    description: 'Public club directory and detail pages are driven by the public contracts, with normalization handled in the client.',
    path: '/public/clubs',
  },
  {
    title: 'Player leaderboard',
    description: 'The leaderboard supports club and status filters and is now reused inside the routed public hall pages.',
    path: '/public/leaderboards/players?status=Active&limit=20',
  },
  {
    title: 'Club applications inbox',
    description: 'The member hub reads pending club applications and falls back to the local inbox bridge when backend data is unavailable.',
    path: 'GET /clubs/:clubId/applications?operatorId=:clubAdminId&status=Pending&limit=20',
  },
  {
    title: 'Tournament tables',
    description: 'The tournament operations page is still scaffold-like, but the table list remains its highest-value backend entry point.',
    path: apiClient.buildTournamentTablesPath('tournament-123', 'stage-demo-swiss', {
      status: 'WaitingPreparation',
      limit: 8,
    }),
  },
  {
    title: 'Player dashboard',
    description: 'The member hub loads player dashboards first and keeps a fallback path for unstable backend availability.',
    path: '/dashboards/players/player-123?operatorId=player-123',
  },
];

const contractChecklist = [
  {
    title: 'Active public endpoints',
    detail:
      'The routed public hall currently centers on /public/schedules, /public/clubs, and /public/leaderboards/players.',
  },
  {
    title: 'Home application flow contracts',
    detail:
      'GET /clubs + GET /players/me + POST /clubs/:clubId/applications + withdraw still form the most important write flow on the homepage.',
  },
  {
    title: 'Normalization that must be preserved',
    detail:
      'The public payloads do not match the frontend view models directly, so the mapping logic in src/api/client.ts remains migration-critical.',
  },
  {
    title: 'Legacy demo endpoints',
    detail:
      'demo/summary and demo/widgets still have value for overview-style content, but they no longer drive the main public hall route.',
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
        <h1>Align the current codebase, API contracts, and routed product experience</h1>
        <p className="hero__summary">
          This blueprint page now focuses on the migrated frontend as it exists today. It summarizes the React router shell,
          the main business features, the current backend touchpoints, and the API-first plus mock-fallback strategy in one place.
        </p>
        <div className="blueprint-hero__chips">
          <span className="portal-inline-badge">React Router</span>
          <span className="portal-inline-badge">Typed Client</span>
          <span className="portal-inline-badge">API First</span>
          <span className="portal-inline-badge">Mock Safe Mode</span>
        </div>
      </div>
      <div className="hero__panel blueprint-hero__panel">
        <p className="hero__panel-title">Current Blueprint Focus</p>
        <ol className="priority-list">
          <li>Make the root route the real project blueprint page rather than a loose collection of static modules.</li>
          <li>Keep the homepage copy aligned with the actual React/router architecture now in the codebase.</li>
          <li>Map the active docs contracts directly to route pages, feature slices, and user flows.</li>
        </ol>
      </div>
      <div className="blueprint-highlights">
        {heroCards.map((item) => (
          <article key={item.title} className="card blueprint-highlight-card">
            <span>{item.label}</span>
            <strong>{item.title}</strong>
            <p>{item.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function BlueprintArchitectureSection() {
  return (
    <section className="section">
      <SectionIntro
        eyebrow="1. Architecture"
        title="How the current frontend is layered after the React migration"
        description="The frontend is no longer a manual DOM shell. It is now a routed React app that keeps the original workbench-style information architecture while gradually moving business logic into feature slices, hooks, and reusable components."
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
          <article key={module.id} className="card module-card">
            <div className="module-card__head">
              <h2>{module.title}</h2>
              <span>{module.primaryRoles.join(' / ')}</span>
            </div>
            <p>{module.summary}</p>
            <p><strong>Key entities</strong> {module.entities.join(' / ')}</p>
            <p><strong>Main entry points</strong> {module.routes.join(' | ')}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function BlueprintRoleMatrixSection() {
  return (
    <section className="section">
      <SectionIntro
        eyebrow="2. Roles & Permissions"
        title="How roles map to routes and workbench abilities"
        description="The app still does not have full route guards, but the role boundaries are already clear. This section keeps the current RBAC picture readable while session state and operator scope continue to evolve."
      />
      <div className="role-grid">
        {roleCapabilities.map((capability) => (
          <article key={capability.role} className="card role-card">
            <div className="role-card__header">
              <h3>{capability.role}</h3>
              <span>{capability.landingRoute}</span>
            </div>
            <p>{capability.description}</p>
            <p><strong>Can read</strong> {capability.canRead.join(' / ') || 'None'}</p>
            <p><strong>Can write</strong> {capability.canWrite.join(' / ') || 'None'}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function BlueprintWorkbenchSection() {
  return (
    <section className="section">
      <SectionIntro
        eyebrow="3. Workbench Flow"
        title="How the blueprint homepage connects the current workbench flow"
        description="This is not meant to be a literal operations console. It is a stitched view of the experience paths already present in the repo, helping the team see how browsing, membership operations, and tournament execution fit together after the migration."
      />
      <div className="workbench-steps">
        {workbenchSteps.map((item, index) => (
          <article key={item.title} className="card workbench-step-card">
            <span>{`0${index + 1}`}</span>
            <h3>{item.title}</h3>
            <p>{item.detail}</p>
          </article>
        ))}
      </div>
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
        eyebrow="4. API Mapping"
        title="Which frontend abilities the blueprint still maps back to backend contracts"
        description="This section does not try to exhaustively list every endpoint. It highlights the contracts that the current homepage, public hall, member hub, and tournament operations routes actually depend on today."
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
          <article key={item.title} className="card api-card api-card--note">
            <h3>{item.title}</h3>
            <p>{item.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
