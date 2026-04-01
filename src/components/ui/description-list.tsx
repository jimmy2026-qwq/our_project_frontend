import type { HTMLAttributes, ReactNode } from 'react';

import { cx } from '@/lib/cx';
import { Separator } from '@/components/ui/separator';

export function DescriptionList({ className, ...props }: HTMLAttributes<HTMLDListElement>) {
  return <dl data-slot="description-list" className={cx('ui-description-list grid gap-3', className)} {...props} />;
}

export function DescriptionItem({
  label,
  value,
  className,
  separator = true,
}: {
  label: ReactNode;
  value: ReactNode;
  className?: string;
  separator?: boolean;
}) {
  return (
    <div data-slot="description-item" className={cx('ui-description-item grid gap-1', className)}>
      <dt className="ui-description-item__label text-sm text-[color:var(--muted)]">{label}</dt>
      <dd className="ui-description-item__value m-0 text-[color:var(--text)]">{value}</dd>
      {separator ? <Separator className="ui-description-item__separator" /> : null}
    </div>
  );
}
