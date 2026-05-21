import type { HTMLAttributes, ReactNode } from 'react';

import { cx } from '@/components/ui/cx';

export function KeyValueList({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="key-value-list" className={cx('grid gap-2.5', className)} {...props} />;
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
    <div data-slot="key-value-item" className={cx('grid gap-1', className)}>
      <span className="text-sm text-[#9ab0c1]">{label}</span>
      <strong className="block text-[#f2f7fb]">{value}</strong>
    </div>
  );
}
