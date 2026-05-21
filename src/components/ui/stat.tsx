import type { HTMLAttributes, ReactNode } from 'react';

import { cva, cx, type VariantProps } from '@/components/ui/cx';

export function StatGrid({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="stat-grid"
      className={cx('grid gap-3 sm:grid-cols-2 xl:grid-cols-3', className)}
      {...props}
    />
  );
}

const statCardVariants = cva(
  'grid gap-2 rounded-3xl border border-[rgba(176,223,229,0.14)] bg-[rgba(255,255,255,0.04)] p-5',
  {
    variants: {
      accent: {
        default: '',
        gold: 'border-[rgba(236,197,122,0.32)]',
        teal: 'border-[rgba(114,216,209,0.32)]',
      },
    },
    defaultVariants: {
      accent: 'default',
    },
  },
);

type StatAccent = 'default' | 'gold' | 'teal';

function normalizeAccent(accent?: string | null): StatAccent {
  if (accent === 'gold' || accent === 'teal') {
    return accent;
  }

  return 'default';
}

export function StatCard({
  label,
  value,
  accent,
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> &
  Omit<VariantProps<typeof statCardVariants>, 'accent'> & {
  label: ReactNode;
  value: ReactNode;
  accent?: string | null;
}) {
  return (
    <div data-slot="stat-card" className={cx(statCardVariants({ accent: normalizeAccent(accent) }), className)} {...props}>
      <span className="text-sm text-[#9ab0c1]">{label}</span>
      <strong className="text-[1.35rem] text-[#f2f7fb]">{value}</strong>
      {children}
    </div>
  );
}
