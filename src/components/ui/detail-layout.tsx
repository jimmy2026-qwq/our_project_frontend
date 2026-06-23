import type { ReactNode } from 'react';

import { cx } from '@/components/ui/cx';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { SourceBadge } from './feedback';

/** 详情页顶部的大型信息区，承载标题、摘要、动作和警告提示。 */
export function DetailHero({
  eyebrow,
  title,
  tagline,
  summary,
  actions,
  warning,
}: {
  eyebrow: string;
  title: string;
  tagline?: ReactNode;
  summary: ReactNode;
  actions?: ReactNode;
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
      <SourceBadge warning={warning} />
    </section>
  );
}

/** 详情页内部的分组卡片。 */
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

/** 详情页的返回入口、头图和正文容器。 */
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

/** 目录页中可复用的条目卡片。 */
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

export {
  DetailList,
  DetailListItem,
  DetailRow,
  DetailRows,
  ListRow,
  MetricCard,
  MetricGrid,
} from './detail-list';
