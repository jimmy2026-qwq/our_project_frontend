import type { ReactNode } from 'react';

import { cx } from '@/components/ui/cx';
import { DescriptionItem, DescriptionList } from './description-list';
import { Separator } from './separator';
import { StatCard, StatGrid } from './stat';

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
