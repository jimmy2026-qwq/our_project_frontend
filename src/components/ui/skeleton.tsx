import type { HTMLAttributes } from 'react';

import { cx } from '@/lib/cx';

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="skeleton"
      className={cx(
        'ui-skeleton animate-pulse rounded-xl bg-[linear-gradient(90deg,rgba(255,255,255,0.04),rgba(255,255,255,0.1),rgba(255,255,255,0.04))]',
        className,
      )}
      aria-hidden="true"
      {...props}
    />
  );
}
