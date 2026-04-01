import type { HTMLAttributes, ReactNode } from 'react';

import { cx } from '@/lib/cx';

export function FilterBar({
  title,
  action,
  className,
  children,
}: HTMLAttributes<HTMLDivElement> & {
  title?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className={cx('ui-filter-bar rounded-3xl border border-[color:var(--line)] bg-[rgba(255,255,255,0.03)] p-5', className)}>
      {title || action ? (
        <div className="ui-filter-bar__head mb-4 flex items-start justify-between gap-4">
          {title ? <h3 className="ui-filter-bar__title">{title}</h3> : <span />}
          {action}
        </div>
      ) : null}
      <div className="ui-filter-bar__body grid gap-4">{children}</div>
    </div>
  );
}
