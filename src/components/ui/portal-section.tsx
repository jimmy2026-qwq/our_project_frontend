import type { ReactNode } from 'react';

import { cx } from '@/components/ui/cx';
import { SourceBadge } from './feedback';

const portalSectionClassNames = {
  root:
    'relative overflow-hidden rounded-[34px] border border-[rgba(241,211,144,0.18)] bg-[rgba(9,18,31,0.88)] bg-[linear-gradient(180deg,rgba(13,24,40,0.94),rgba(11,20,34,0.9))] p-[26px] shadow-[0_24px_70px_rgba(5,10,18,0.28),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-[18px]',
  ornament:
    'pointer-events-none absolute inset-x-0 top-0 h-[108px] w-[min(420px,56%)] bg-[url("/mahjong-soul/decorative/match-lobby-atlas.png")] bg-cover bg-left-top bg-no-repeat opacity-[0.09]',
  head: 'flex items-start justify-between gap-4',
  eyebrow:
    'm-0 text-[0.82rem] uppercase tracking-[0.16em] text-[#ecc57a]',
  title:
    'my-2 text-[clamp(1.7rem,2.8vw,2.7rem)] text-[#f2f7fb]',
  description:
    'm-0 leading-[1.8] text-[#c7d6e2] [text-shadow:0_1px_12px_rgba(3,8,14,0.18)]',
};

export function PortalSection({
  eyebrow,
  title,
  description,
  source,
  warning,
  children,
  className,
  slotClassNames,
}: {
  eyebrow: string;
  title: ReactNode;
  description: ReactNode;
  source?: 'api' | 'mock';
  warning?: string;
  children: ReactNode;
  className?: string;
  slotClassNames?: {
    ornament?: string;
    head?: string;
    headContent?: string;
    eyebrow?: string;
    title?: string;
    description?: string;
    sourceBadge?: string;
  };
}) {
  return (
    <section
      className={cx(
        portalSectionClassNames.root,
        className,
      )}
    >
      <div
        className={cx(portalSectionClassNames.ornament, slotClassNames?.ornament)}
        aria-hidden="true"
      />
      <div
        className={cx(
          portalSectionClassNames.head,
          slotClassNames?.head,
        )}
      >
        <div className={slotClassNames?.headContent}>
          <p className={cx(portalSectionClassNames.eyebrow, slotClassNames?.eyebrow)}>{eyebrow}</p>
          <h2
            className={cx(
              portalSectionClassNames.title,
              slotClassNames?.title,
            )}
          >
            {title}
          </h2>
          <p className={cx(portalSectionClassNames.description, slotClassNames?.description)}>
            {description}
          </p>
        </div>
        <SourceBadge
          className={slotClassNames?.sourceBadge}
          source={source}
          warning={warning}
        />
      </div>
      {children}
    </section>
  );
}
