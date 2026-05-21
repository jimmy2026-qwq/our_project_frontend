import type { HTMLAttributes } from 'react';

import { cva, cx, type VariantProps } from '@/components/ui/cx';

const badgeVariants = cva(
  [
    'inline-flex w-fit items-center justify-center gap-1 rounded-full border px-3 py-1.5',
    'text-[0.78rem] tracking-[0.06em] whitespace-nowrap',
  ].join(' '),
  {
    variants: {
      variant: {
        default: 'border-[rgba(176,223,229,0.14)] bg-[rgba(255,255,255,0.04)] text-[#f2f7fb]',
        accent: 'border-transparent bg-[rgba(236,197,122,0.14)] text-[#ecc57a]',
        success: 'border-transparent bg-[rgba(114,216,209,0.14)] text-[#8fe8e1]',
        warning: 'border-transparent bg-[rgba(236,197,122,0.14)] text-[#ecc57a]',
        danger: 'border-transparent bg-[rgba(236,122,122,0.14)] text-[#ffb0a8]',
        outline: 'border-[rgba(176,223,229,0.14)] bg-[rgba(255,255,255,0.04)] text-[#f2f7fb]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return <span data-slot="badge" className={cx(badgeVariants({ variant }), className)} {...props} />;
}
