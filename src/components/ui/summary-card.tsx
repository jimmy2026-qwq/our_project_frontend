import type { ElementType, ReactNode } from 'react';

import { cx } from '@/components/ui/cx';

export function InfoSummaryGrid({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cx('grid gap-[18px]', className)}>
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
    <article
      className={cx(
        'min-h-full rounded-[24px] border border-[rgba(176,223,229,0.14)] bg-[rgba(14,31,46,0.78)] p-[22px] text-[#f2f7fb] shadow-[0_18px_48px_rgba(0,0,0,0.22)] backdrop-blur-[18px]',
        className,
      )}
    >
      <span className="relative z-[1] mb-3 inline-flex w-fit rounded-full border border-[rgba(176,223,229,0.14)] bg-[rgba(236,197,122,0.08)] px-[10px] py-[6px] text-[0.8rem] text-[#ecc57a]">
        {label}
      </span>
      <TitleTag className="mb-[10px] block text-[#f2f7fb]">
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
    <article
      className={cx(
        'rounded-[24px] border border-[rgba(176,223,229,0.14)] bg-[rgba(14,31,46,0.78)] p-[22px] text-[#f2f7fb] shadow-[0_18px_48px_rgba(0,0,0,0.22)] backdrop-blur-[18px]',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="mb-[10px] text-[#f2f7fb]">{title}</h3>
        {subtitle ? (
          <span className="text-[#9ab0c1]">{subtitle}</span>
        ) : null}
      </div>
      {summary ? <p className="leading-[1.75] text-[#9ab0c1]">{summary}</p> : null}
      {details}
    </article>
  );
}
