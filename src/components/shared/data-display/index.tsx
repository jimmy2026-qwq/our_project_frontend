import type { ReactNode } from 'react';

import { SourceBadge } from '@/components/shared/feedback';
import { PanelHead } from '@/components/shared/layout';
import { cx } from '@/components/shared/utils';

export function DataPanel({
  title,
  description,
  children,
  source,
  warning,
  badgeLabel,
  className,
}: {
  title: string;
  description?: ReactNode;
  children: ReactNode;
  source?: 'api' | 'mock';
  warning?: string;
  badgeLabel?: string;
  className?: string;
}) {
  return (
    <article className={cx('card', 'panel-card', className)}>
      <PanelHead
        title={title}
        description={description}
        aside={<SourceBadge source={source} warning={warning} label={badgeLabel} />}
      />
      {children}
    </article>
  );
}

export function PortalSection({
  eyebrow,
  title,
  description,
  source,
  warning,
  children,
}: {
  eyebrow: string;
  title: string;
  description: ReactNode;
  source?: 'api' | 'mock';
  warning?: string;
  children: ReactNode;
}) {
  return (
    <section className="portal-section">
      <div className="portal-section__head">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <SourceBadge source={source} warning={warning} />
      </div>
      {children}
    </section>
  );
}

export function DetailHero({
  eyebrow,
  title,
  tagline,
  summary,
  source,
  warning,
}: {
  eyebrow: string;
  title: string;
  tagline?: ReactNode;
  summary: ReactNode;
  source?: 'api' | 'mock';
  warning?: string;
}) {
  return (
    <section className="detail-hero">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {tagline ? <p className="detail-hero__tagline">{tagline}</p> : null}
        <p className="detail-hero__summary">{summary}</p>
      </div>
      <SourceBadge source={source} warning={warning} />
    </section>
  );
}

export function DetailCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <article className="detail-card">
      <h2>{title}</h2>
      {children}
    </article>
  );
}

export function ListRow({
  main,
  aside,
  className,
}: {
  main: ReactNode;
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <li className={cx('list-row', className)}>
      <div>{main}</div>
      {aside ? <div>{aside}</div> : null}
    </li>
  );
}

export function MetricGrid({ children }: { children: ReactNode }) {
  return <div className="metric-grid">{children}</div>;
}

export function MetricCard({
  label,
  value,
  accent,
}: {
  label: ReactNode;
  value: ReactNode;
  accent?: string;
}) {
  return (
    <div className={cx('metric', accent ? `metric--${accent}` : undefined)}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export function DetailList({ children }: { children: ReactNode }) {
  return <dl className="detail-list">{children}</dl>;
}

export function DetailListItem({
  label,
  value,
}: {
  label: ReactNode;
  value: ReactNode;
}) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

export function DetailRows({ children }: { children: ReactNode }) {
  return <ul className="detail-rows">{children}</ul>;
}

export function DetailRow({
  title,
  detail,
}: {
  title: ReactNode;
  detail: ReactNode;
}) {
  return (
    <li>
      <strong>{title}</strong>
      <span>{detail}</span>
    </li>
  );
}
