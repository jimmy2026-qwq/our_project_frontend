import type { HTMLAttributes } from 'react';

import { cva, cx, type VariantProps } from '@/components/ui/cx';

const statusPillVariants = cva(
  'inline-flex w-fit items-center justify-center rounded-full border px-3 py-1 text-xs font-medium whitespace-nowrap',
  {
    variants: {
      tone: {
        neutral: 'border-[rgba(176,223,229,0.14)] bg-[rgba(255,255,255,0.04)] text-[#f2f7fb]',
        info: 'border-[rgba(114,216,209,0.24)] bg-[rgba(114,216,209,0.1)] text-[#8fe8e1]',
        success: 'border-[rgba(114,216,209,0.3)] bg-[rgba(114,216,209,0.14)] text-[#8fe8e1]',
        warning: 'border-[rgba(236,197,122,0.3)] bg-[rgba(236,197,122,0.14)] text-[#ecc57a]',
        danger: 'border-[rgba(236,122,122,0.28)] bg-[rgba(236,122,122,0.14)] text-[#ffb0a8]',
      },
    },
    defaultVariants: {
      tone: 'neutral',
    },
  },
);

export interface StatusPillProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusPillVariants> {}

export function StatusPill({ className, tone = 'neutral', ...props }: StatusPillProps) {
  return <span data-slot="status-pill" className={cx(statusPillVariants({ tone }), className)} {...props} />;
}
