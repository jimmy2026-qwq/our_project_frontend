import { DataPanel, InfoSummaryCard, InfoSummaryGrid, ListRow, MetricCard, MetricGrid } from '@/components/shared/data-display';
import { SectionIntro } from '@/components/shared/layout';
import { mockClubs, mockDashboards, mockLeaderboard, mockSchedules } from '@/mocks/overview';

import { workbenchSteps } from './sections.content';
import { formatLocalTime } from './sections.shared';

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
