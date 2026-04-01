import type { HTMLAttributes } from 'react';

import { cva, cx, type VariantProps } from '@/lib/cx';

const alertVariants = cva(
  'ui-alert relative grid w-full gap-2 rounded-[20px] border px-[18px] py-4 text-sm',
  {
    variants: {
      variant: {
        default: 'ui-alert--default border-[color:var(--line)] bg-[rgba(255,255,255,0.04)]',
        warning: 'ui-alert--warning border-[rgba(236,197,122,0.28)] bg-[rgba(255,255,255,0.04)]',
        danger: 'ui-alert--danger border-[rgba(236,122,122,0.28)] bg-[rgba(255,255,255,0.04)]',
        success: 'ui-alert--success border-[rgba(114,216,209,0.28)] bg-[rgba(255,255,255,0.04)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface AlertProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

export function Alert({ className, variant = 'default', ...props }: AlertProps) {
  return <div data-slot="alert" role="alert" className={cx(alertVariants({ variant }), className)} {...props} />;
}

export function AlertTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h5 data-slot="alert-title" className={cx('ui-alert__title m-0 text-[0.98rem]', className)} {...props} />;
}

export function AlertDescription({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="alert-description"
      className={cx('ui-alert__description text-[color:var(--muted)] leading-[1.7] [&_p]:m-0', className)}
      {...props}
    />
  );
}
