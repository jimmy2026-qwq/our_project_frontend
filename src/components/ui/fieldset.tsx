import type { FieldsetHTMLAttributes, HTMLAttributes } from 'react';

import { cx } from '@/components/ui/cx';

export function Fieldset({ className, ...props }: FieldsetHTMLAttributes<HTMLFieldSetElement>) {
  return (
    <fieldset
      data-slot="fieldset"
      className={cx('m-0 grid gap-2 rounded-[18px] border border-[rgba(176,223,229,0.14)] bg-[rgba(255,255,255,0.03)] px-[18px] py-4', className)}
      {...props}
    />
  );
}

export function FieldsetLegend({ className, ...props }: HTMLAttributes<HTMLLegendElement>) {
  return <legend data-slot="fieldset-legend" className={cx('px-2 text-[0.84rem] font-medium tracking-[0.06em] text-[#ecc57a]', className)} {...props} />;
}

export function FieldsetBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="fieldset-body" className={cx('grid gap-2 leading-[1.7] text-[#9ab0c1]', className)} {...props} />;
}
