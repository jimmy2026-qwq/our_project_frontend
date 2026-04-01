import type { HTMLAttributes, ReactNode } from 'react';

import { cva, cx, type VariantProps } from '@/lib/cx';

export function StatGrid({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="stat-grid"
      className={cx('ui-stat-grid grid gap-3 sm:grid-cols-2 xl:grid-cols-3', className)}
      {...props}
    />
  );
}

const statCardVariants = cva(
  'ui-stat grid gap-2 rounded-3xl border border-[color:var(--line)] bg-[rgba(255,255,255,0.04)] p-5',
  {
    variants: {
      accent: {
        default: '',
        gold: 'ui-stat--gold border-[rgba(236,197,122,0.32)]',
        teal: 'ui-stat--teal border-[rgba(114,216,209,0.32)]',
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
      <span className="ui-stat__label text-sm text-[color:var(--muted)]">{label}</span>
      <strong className="ui-stat__value text-[1.35rem] text-[color:var(--text)]">{value}</strong>
      {children}
    </div>
  );
}
