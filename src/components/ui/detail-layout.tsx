import type { ReactNode } from 'react';

import { cx } from '@/lib/cx';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { DescriptionItem, DescriptionList } from './description-list';
import { SourceBadge } from './feedback';
import { Separator } from './separator';
import { StatCard, StatGrid } from './stat';

export function DetailHero({
  eyebrow,
  title,
  tagline,
  summary,
  actions,
  source,
  warning,
}: {
  eyebrow: string;
  title: string;
  tagline?: ReactNode;
  summary: ReactNode;
  actions?: ReactNode;
  source?: 'api' | 'mock';
  warning?: string;
}) {
  return (
    <section
      className={cx(
        'detail-hero grid gap-4 rounded-[var(--radius-xl)] p-[30px]',
        'grid-cols-[minmax(0,1.25fr)_minmax(280px,0.75fr)]',
        'bg-[radial-gradient(circle_at_top_right,rgba(114,216,209,0.1),transparent_30%),linear-gradient(180deg,rgba(17,34,49,0.94),rgba(9,20,30,0.9))]',
      )}
    >
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-[clamp(2.2rem,4vw,4.4rem)]">{title}</h1>
          {actions}
        </div>
        {tagline ? (
          <p className="detail-hero__tagline mb-3 text-[1.04rem] text-[color:var(--gold)]">
            {tagline}
          </p>
        ) : null}
        <p className="detail-hero__summary max-w-[62ch] leading-8">{summary}</p>
      </div>
      <SourceBadge source={source} warning={warning} />
    </section>
  );
}

export function DetailCard({
  title,
  children,
}: {
  title: ReactNode;
  children: ReactNode;
}) {
  return (
    <Card className="detail-card">
      <CardHeader className="detail-card__header pb-0">
        <CardTitle className="detail-card__title">{title}</CardTitle>
      </CardHeader>
      <CardContent className="detail-card__content pt-4">
        {children}
      </CardContent>
    </Card>
  );
}

export function DetailPageShell({
  backLink,
  hero,
  children,
}: {
  backLink: ReactNode;
  hero: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="detail-page grid gap-6">
      {backLink}
      {hero}
      {children}
    </section>
  );
}

export function DirectoryCard({
  className,
  top,
  title,
  subtitle,
  summary,
  meta,
  action,
}: {
  className?: string;
  top?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  summary?: ReactNode;
  meta?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <article
      className={cx(
        'grid gap-4 rounded-3xl bg-[color:var(--panel)] p-[22px]',
        className,
      )}
    >
      {top ? <div className="grid gap-4">{top}</div> : null}
      <h3 className="m-0 text-[color:var(--text)]">{title}</h3>
      {subtitle ? (
        <p className="m-0 leading-8 text-[color:var(--muted-strong)]">
          {subtitle}
        </p>
      ) : null}
      {summary ? (
        <p className="m-0 leading-8 text-[color:var(--muted-strong)]">
          {summary}
        </p>
      ) : null}
      {meta}
      {action}
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
    <li
      className={cx(
        'list-row grid gap-4 border-t border-[color:var(--line)] pt-4 first:border-t-0 first:pt-0 md:grid-cols-[minmax(0,1fr)_auto] md:items-start',
        className,
      )}
    >
      <div>{main}</div>
      {aside ? <div className="grid gap-1">{aside}</div> : null}
    </li>
  );
}

export function MetricGrid({ children }: { children: ReactNode }) {
  return (
    <StatGrid className="metric-grid mt-[18px] grid gap-3 md:grid-cols-3">
      {children}
    </StatGrid>
  );
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
    <StatCard
      className="metric min-h-full"
      label={label}
      value={value}
      accent={accent}
    />
  );
}

export function DetailList({ children }: { children: ReactNode }) {
  return (
    <DescriptionList className="detail-list m-0 grid gap-3 p-0">
      {children}
    </DescriptionList>
  );
}

export function DetailListItem({
  label,
  value,
}: {
  label: ReactNode;
  value: ReactNode;
}) {
  return (
    <DescriptionItem
      className="detail-list__item [&_.ui-description-item__separator]:mt-2 last:[&_.ui-description-item__separator]:hidden"
      label={label}
      value={value}
    />
  );
}

export function DetailRows({ children }: { children: ReactNode }) {
  return (
    <ul className="detail-rows m-0 grid list-none gap-3 p-0">{children}</ul>
  );
}

export function DetailRow({
  title,
  detail,
}: {
  title: ReactNode;
  detail: ReactNode;
}) {
  return (
    <li className="grid gap-1 border-t border-[color:var(--line)] pt-3 first:border-t-0 first:pt-0 last:[&_.detail-rows__separator]:hidden">
      <strong className="text-[color:var(--text)]">{title}</strong>
      <span className="text-[color:var(--muted)]">{detail}</span>
      <Separator className="detail-rows__separator mt-2" />
    </li>
  );
}
