import type { HTMLAttributes } from 'react';

import { cva, cx, type VariantProps } from '@/components/ui/cx';

const alertVariants = cva(
  'relative grid w-full gap-2 rounded-[20px] border bg-[rgba(255,255,255,0.04)] px-[18px] py-4 text-sm transition-[transform,border-color,background-color,box-shadow,color,opacity] duration-200',
  {
    variants: {
      variant: {
        default: 'border-[rgba(176,223,229,0.14)]',
        warning: 'border-[rgba(236,197,122,0.28)]',
        danger: 'border-[rgba(236,122,122,0.28)]',
        success: 'border-[rgba(114,216,209,0.28)]',
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
  return <h5 data-slot="alert-title" className={cx('m-0 text-[0.98rem] text-[#f2f7fb]', className)} {...props} />;
}

export function AlertDescription({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="alert-description"
      className={cx('leading-[1.7] text-[#9ab0c1] [&_p]:m-0 [&_p+p]:mt-2', className)}
      {...props}
    />
  );
}
