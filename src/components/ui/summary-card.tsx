import type { ElementType, ReactNode } from 'react';

import { cx } from '@/lib/cx';

export function InfoSummaryGrid({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cx('shared-summary-grid grid gap-[18px]', className)}>
      {children}
    </div>
  );
}

export function InfoSummaryCard({
  label,
  title,
  detail,
  titleAs: TitleTag = 'strong',
  detailAs: DetailTag = 'p',
  className,
}: {
  label: ReactNode;
  title: ReactNode;
  detail: ReactNode;
  titleAs?: ElementType;
  detailAs?: ElementType;
  className?: string;
}) {
  return (
    <article className={cx('card shared-summary-card min-h-full', className)}>
      <span className="shared-summary-card__label mb-3 inline-flex w-fit rounded-full border border-[color:var(--line)] bg-[rgba(236,197,122,0.08)] px-[10px] py-[6px] text-[0.8rem] text-[color:var(--gold)]">
        {label}
      </span>
      <TitleTag className="mb-[10px] block text-[color:var(--text)]">
        {title}
      </TitleTag>
      <DetailTag>{detail}</DetailTag>
    </article>
  );
}

export function MetadataCard({
  title,
  subtitle,
  summary,
  details,
  className,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  summary?: ReactNode;
  details?: ReactNode;
  className?: string;
}) {
  return (
    <article className={cx('card shared-metadata-card', className)}>
      <div className="shared-metadata-card__head flex items-start justify-between gap-4">
        <h3 className="mb-[10px] text-[color:var(--text)]">{title}</h3>
        {subtitle ? (
          <span className="text-[color:var(--muted)]">{subtitle}</span>
        ) : null}
      </div>
      {summary ? <p>{summary}</p> : null}
      {details}
    </article>
  );
}
