import type { HTMLAttributes } from 'react';

import { cva, cx, type VariantProps } from '@/lib/cx';

const statusPillVariants = cva(
  'ui-status-pill inline-flex w-fit items-center justify-center rounded-full border px-3 py-1 text-xs font-medium whitespace-nowrap',
  {
    variants: {
      tone: {
        neutral: 'ui-status-pill--neutral border-[color:var(--line)] bg-[rgba(255,255,255,0.04)] text-[color:var(--text)]',
        info: 'ui-status-pill--info border-[rgba(114,216,209,0.24)] bg-[rgba(114,216,209,0.1)] text-[color:var(--teal-strong)]',
        success: 'ui-status-pill--success border-[rgba(114,216,209,0.3)] bg-[rgba(114,216,209,0.14)] text-[color:var(--teal-strong)]',
        warning: 'ui-status-pill--warning border-[rgba(236,197,122,0.3)] bg-[rgba(236,197,122,0.14)] text-[color:var(--gold)]',
        danger: 'ui-status-pill--danger border-[rgba(236,122,122,0.28)] bg-[rgba(236,122,122,0.14)] text-[#ffb0a8]',
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
