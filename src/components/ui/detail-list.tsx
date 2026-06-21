import type { ReactNode } from 'react';

import { cx } from '@/components/ui/cx';
import { DescriptionItem, DescriptionList } from './description-list';
import { Separator } from './separator';
import { StatCard, StatGrid } from './stat';

/** 详情列表中带主内容和右侧附加信息的一行。 */
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

/** 详情页指标卡片的响应式网格。 */
export function MetricGrid({ children }: { children: ReactNode }) {
  return (
    <StatGrid className="mt-[18px] grid gap-3 md:grid-cols-3">
      {children}
    </StatGrid>
  );
}

/** 详情页中单个指标的展示卡。 */
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

/** 详情页键值信息列表。 */
export function DetailList({ children }: { children: ReactNode }) {
  return (
    <DescriptionList className="m-0 grid gap-3 p-0 [&_dd]:m-0 [&_dd]:font-semibold [&_dt]:text-[#c7d6e2]">
      {children}
    </DescriptionList>
  );
}

/** 详情页键值信息列表中的单项。 */
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

/** 使用列表语义呈现多条详情行。 */
export function DetailRows({ children }: { children: ReactNode }) {
  return (
    <ul className="m-0 grid list-none gap-3 p-0">{children}</ul>
  );
}

/** 详情列表中带标题和正文的一行。 */
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
