import type { HTMLAttributes, ReactNode } from 'react';

import { cx } from '@/lib/cx';

export function KeyValueList({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="key-value-list" className={cx('ui-key-value-list grid gap-3', className)} {...props} />;
}

export function KeyValueItem({
  label,
  value,
  className,
}: {
  label: ReactNode;
  value: ReactNode;
  className?: string;
}) {
  return (
    <div data-slot="key-value-item" className={cx('ui-key-value-item grid gap-1', className)}>
      <span className="ui-key-value-item__label text-sm text-[color:var(--muted)]">{label}</span>
      <strong className="ui-key-value-item__value text-[color:var(--text)]">{value}</strong>
    </div>
  );
}
