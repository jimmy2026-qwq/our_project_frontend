import { InfoSummaryCard, InfoSummaryGrid, MetadataCard } from '@/components/shared/data-display';
import { SectionIntro } from '@/components/shared/layout';
import { Separator } from '@/components/ui';
import { featureModules } from '@/config/modules';

import { foundationLayers, migrationTracks } from './sections.content';

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
