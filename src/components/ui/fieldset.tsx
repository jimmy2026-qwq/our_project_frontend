import type { FieldsetHTMLAttributes, HTMLAttributes } from 'react';

import { cx } from '@/lib/cx';

export function Fieldset({ className, ...props }: FieldsetHTMLAttributes<HTMLFieldSetElement>) {
  return (
    <fieldset
      data-slot="fieldset"
      className={cx('ui-fieldset grid gap-2 rounded-2xl border border-[color:var(--line)] p-4', className)}
      {...props}
    />
  );
}

export function FieldsetLegend({ className, ...props }: HTMLAttributes<HTMLLegendElement>) {
  return <legend data-slot="fieldset-legend" className={cx('ui-fieldset__legend px-2 text-sm font-medium text-[color:var(--gold)]', className)} {...props} />;
}

export function FieldsetBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="fieldset-body" className={cx('ui-fieldset__body grid gap-2 text-[color:var(--muted)]', className)} {...props} />;
}
