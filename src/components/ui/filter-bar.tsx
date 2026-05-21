import type { HTMLAttributes, ReactNode } from 'react';

import { cx } from '@/components/ui/cx';

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
    <div className={cx('rounded-3xl border border-[rgba(176,223,229,0.14)] bg-[rgba(255,255,255,0.03)] p-5', className)}>
      {title || action ? (
        <div className="mb-4 flex items-start justify-between gap-4">
          {title ? <h3 className="text-[#f2f7fb]">{title}</h3> : <span />}
          {action}
        </div>
      ) : null}
      <div className="grid gap-4">{children}</div>
    </div>
  );
}
