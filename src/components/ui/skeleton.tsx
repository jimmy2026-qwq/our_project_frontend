import type { HTMLAttributes } from 'react';

import { cx } from '@/components/ui/cx';

/** 加载中内容占位骨架。 */
export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="skeleton"
      className={cx(
        'animate-pulse rounded-xl bg-[linear-gradient(90deg,rgba(255,255,255,0.04),rgba(255,255,255,0.1),rgba(255,255,255,0.04))]',
        className,
      )}
      aria-hidden="true"
      {...props}
    />
  );
}
