import { SectionCallout } from '@/components/ui';
import { WorkbenchBacklogPanel } from '@/components/shared/domain';
import { SectionIntro } from '@/components/shared/layout';

import { contractChecklist, routeDependencyBacklog, sampleRequests } from './sections.content';

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
