import type { ReactNode } from 'react';

import { cx } from '@/components/ui/cx';
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
        'grid gap-4 rounded-[32px] border border-[rgba(176,223,229,0.14)] p-[30px] shadow-[0_18px_48px_rgba(0,0,0,0.22)] backdrop-blur-[18px]',
        'grid-cols-[minmax(0,1.25fr)_minmax(280px,0.75fr)] max-[980px]:grid-cols-1 max-[980px]:p-6',
        'bg-[radial-gradient(circle_at_top_right,rgba(114,216,209,0.1),transparent_30%),linear-gradient(180deg,rgba(17,34,49,0.94),rgba(9,20,30,0.9))]',
      )}
    >
      <div>
        <p className="m-0 text-[0.78rem] uppercase tracking-[0.16em] text-[#ecc57a]">
          {eyebrow}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="my-3 mb-4 text-[clamp(2.2rem,4vw,4.4rem)] leading-none text-[#f2f7fb]">
            {title}
          </h1>
          {actions}
        </div>
        {tagline ? (
          <p className="mb-3 text-[1.04rem] text-[#ecc57a]">
            {tagline}
          </p>
        ) : null}
        <p className="m-0 max-w-[62ch] leading-8 text-[#c7d6e2] [text-shadow:0_1px_14px_rgba(3,8,14,0.24)]">
          {summary}
        </p>
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
    <Card className="border-[rgba(176,223,229,0.14)] bg-[rgba(14,31,46,0.78)] p-[22px] shadow-[0_18px_48px_rgba(0,0,0,0.22)] backdrop-blur-[18px]">
      <CardHeader className="pb-0">
        <CardTitle className="text-[#f2f7fb]">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">{children}</CardContent>
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
    <section className="grid gap-6 text-[#f2f7fb]">
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
        'grid gap-4 rounded-3xl bg-[rgba(14,31,46,0.78)] p-[22px]',
        className,
      )}
    >
      {top ? <div className="grid gap-4">{top}</div> : null}
      <h3 className="m-0 text-[#f2f7fb]">{title}</h3>
      {subtitle ? (
        <p className="m-0 leading-8 text-[#c7d6e2]">
          {subtitle}
        </p>
      ) : null}
      {summary ? (
        <p className="m-0 leading-8 text-[#c7d6e2]">
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
        'grid gap-4 border-t border-[rgba(176,223,229,0.14)] pt-4 text-[#c7d6e2] first:border-t-0 first:pt-0 md:grid-cols-[minmax(0,1fr)_auto] md:items-start',
        '[&_strong]:block [&_strong]:text-[#f2f7fb] [&_span]:leading-7 [&_span]:text-[#9ab0c1]',
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
    <StatGrid className="mt-[18px] grid gap-3 md:grid-cols-3">
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
      className="min-h-full"
      label={label}
      value={value}
      accent={accent}
    />
  );
}

export function DetailList({ children }: { children: ReactNode }) {
  return (
    <DescriptionList className="m-0 grid gap-3 p-0 [&_dd]:m-0 [&_dd]:font-semibold [&_dt]:text-[#c7d6e2]">
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
      label={label}
      value={value}
    />
  );
}

export function DetailRows({ children }: { children: ReactNode }) {
  return (
    <ul className="m-0 grid list-none gap-3 p-0">{children}</ul>
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
    <li className="grid gap-1 border-t border-[rgba(176,223,229,0.14)] pt-3 first:border-t-0 first:pt-0 last:[&_[data-slot=separator]]:hidden">
      <strong className="text-[#f2f7fb]">{title}</strong>
      <span className="text-[#c7d6e2] [text-shadow:0_1px_12px_rgba(3,8,14,0.18)]">
        {detail}
      </span>
      <Separator className="mt-2" />
    </li>
  );
}
