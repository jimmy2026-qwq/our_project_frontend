import { InfoSummaryCard, InfoSummaryGrid } from '@/components/shared/data-display';
import { InfoCard } from '@/components/ui';

import { heroCards } from './sections.content';

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
