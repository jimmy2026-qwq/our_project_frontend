import type { ReactNode } from 'react';

import { cx } from '@/lib/cx';
import { SourceBadge } from './feedback';

export function PortalSection({
  eyebrow,
  title,
  description,
  source,
  warning,
  children,
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  description: ReactNode;
  source?: 'api' | 'mock';
  warning?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cx(
        'portal-section rounded-[var(--radius-xl)] bg-[color:var(--bg-elevated)] p-[26px]',
        className,
      )}
    >
      <div className="portal-section__ornament" aria-hidden="true" />
      <div className="portal-section__head flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="my-2 text-[clamp(1.7rem,2.8vw,2.7rem)]">{title}</h2>
          <p className="m-0 leading-8">{description}</p>
        </div>
        <SourceBadge source={source} warning={warning} />
      </div>
      {children}
    </section>
  );
}
