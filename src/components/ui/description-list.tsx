import type { HTMLAttributes, ReactNode } from 'react';

import { cx } from '@/components/ui/cx';
import { Separator } from '@/components/ui/separator';

export function DescriptionList({ className, ...props }: HTMLAttributes<HTMLDListElement>) {
  return <dl data-slot="description-list" className={cx('m-0 grid gap-3 p-0', className)} {...props} />;
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
    <div
      data-slot="description-item"
      className={cx('grid gap-1 last:[&_[data-slot=description-item-separator]]:hidden', className)}
    >
      <dt className="text-sm text-[#9ab0c1]">{label}</dt>
      <dd className="m-0 font-semibold text-[#f2f7fb]">{value}</dd>
      {separator ? <Separator data-slot="description-item-separator" className="mt-2" /> : null}
    </div>
  );
}
