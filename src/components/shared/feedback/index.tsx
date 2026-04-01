import type { ReactNode } from 'react';

import { Badge, Card, CardContent, EmptyStateBlock, Skeleton } from '@/components/ui';
import { SectionIntro } from '@/components/shared/layout';

export function SourceBadge({
  source,
  warning,
  label,
}: {
  source?: 'api' | 'mock';
  warning?: string;
  label?: string;
}) {
  if (!source) {
    return null;
  }

  return (
    <div className="shared-feedback-meta flex flex-col gap-[14px] md:items-end">
      <Badge
        className={`source-badge source-badge--${source}`}
        variant={source === 'api' ? 'success' : 'warning'}
      >
        {label ?? (source === 'api' ? 'API' : 'Mock')}
      </Badge>
      {warning ? (
        <p className="shared-feedback-warning m-0 max-w-[30ch] text-left text-[0.82rem] md:text-right">
          {warning}
        </p>
      ) : null}
    </div>
  );
}

export function EmptyState({ children, asListItem = false }: { children: ReactNode; asListItem?: boolean }) {
  if (asListItem) {
    return (
      <li className="list-row shared-empty-state text-[color:var(--muted)]">
        <EmptyStateBlock description={children} />
      </li>
    );
  }

  return <EmptyStateBlock className="shared-empty-state text-[color:var(--muted)]" description={children} />;
}

export function LoadingCard({ children }: { children: ReactNode }) {
  return (
    <Card className="shared-loading-card">
      <CardContent className="shared-loading-card__body grid gap-3">
        <Skeleton className="shared-loading-card__skeleton shared-loading-card__skeleton--title h-5 w-[48%]" />
        <Skeleton className="shared-loading-card__skeleton h-[14px]" />
        <Skeleton className="shared-loading-card__skeleton shared-loading-card__skeleton--short h-[14px] w-[68%]" />
        <p className="mt-1 mb-0">{children}</p>
      </CardContent>
    </Card>
  );
}

export function LoadingSection({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: ReactNode;
  title: ReactNode;
  description: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="section">
      <SectionIntro eyebrow={eyebrow} title={title} description={description} />
      <LoadingCard>{children}</LoadingCard>
    </section>
  );
}
