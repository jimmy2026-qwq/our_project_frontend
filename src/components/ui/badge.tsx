import type { HTMLAttributes } from 'react';

import { cva, cx, type VariantProps } from '@/lib/cx';

const badgeVariants = cva(
  [
    'ui-badge inline-flex w-fit items-center justify-center gap-1 rounded-full border px-3 py-1.5',
    'text-[0.78rem] tracking-[0.06em] whitespace-nowrap',
  ].join(' '),
  {
    variants: {
      variant: {
        default: 'ui-badge--default border-[color:var(--line)] bg-[rgba(255,255,255,0.04)] text-[color:var(--text)]',
        accent: 'ui-badge--accent border-transparent bg-[rgba(236,197,122,0.14)] text-[color:var(--gold)]',
        success: 'ui-badge--success border-transparent bg-[rgba(114,216,209,0.14)] text-[color:var(--teal-strong)]',
        warning: 'ui-badge--warning border-transparent bg-[rgba(236,197,122,0.14)] text-[color:var(--gold)]',
        danger: 'ui-badge--danger border-transparent bg-[rgba(236,122,122,0.14)] text-[#ffb0a8]',
        outline: 'ui-badge--outline border-[color:var(--line)] bg-[rgba(255,255,255,0.04)] text-[color:var(--text)]',
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
