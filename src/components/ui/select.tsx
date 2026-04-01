import type { SelectHTMLAttributes } from 'react';

import { cx } from '@/lib/cx';

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      data-slot="select"
      className={cx(
        'ui-select flex min-h-11 w-full rounded-[14px] border border-[color:var(--line)]',
        'bg-[rgba(5,14,23,0.88)] px-3.5 py-[11px] text-[color:var(--text)]',
        'shadow-xs outline-none transition-[transform,border-color,background-color,box-shadow,color,opacity] duration-200',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-55',
        'focus-visible:border-[rgba(114,216,209,0.36)] focus-visible:shadow-[0_0_0_3px_rgba(114,216,209,0.12)]',
        'focus-visible:outline-none hover:enabled:-translate-y-px',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
