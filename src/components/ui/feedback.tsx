import type { ReactNode } from 'react';

import { Badge } from './badge';
import { Card, CardContent } from './card';
import { EmptyStateBlock } from './empty-state';
import { Skeleton } from './skeleton';
import { SectionIntro } from './layout';
import { cx } from './cx';

export function SourceBadge({
  source,
  warning,
  label,
  className,
}: {
  source?: 'api' | 'mock';
  warning?: string;
  label?: string;
  className?: string;
}) {
  if (!source) {
    return null;
  }

  return (
    <div className={cx('flex flex-col gap-[14px] md:items-end', className)}>
      <Badge
        variant={source === 'api' ? 'success' : 'warning'}
      >
        {label ?? (source === 'api' ? 'API' : 'Mock')}
      </Badge>
      {warning ? (
        <p className="m-0 max-w-[30ch] text-left text-[0.82rem] leading-6 text-[#c7d6e2] md:text-right">
          {warning}
        </p>
      ) : null}
    </div>
  );
}

export function EmptyState({ children, asListItem = false }: { children: ReactNode; asListItem?: boolean }) {
  if (asListItem) {
    return (
      <li className="grid gap-4 border-t border-[rgba(176,223,229,0.14)] pt-4 text-[#9ab0c1] first:border-t-0 first:pt-0">
        <EmptyStateBlock description={children} />
      </li>
    );
  }

  return <EmptyStateBlock description={children} />;
}

export function LoadingCard({ children }: { children: ReactNode }) {
  return (
    <Card>
      <CardContent className="grid gap-3">
        <Skeleton className="h-5 w-[48%]" />
        <Skeleton className="h-[14px]" />
        <Skeleton className="h-[14px] w-[68%]" />
        <p className="mt-1 mb-0">{children}</p>
      </CardContent>
    </Card>
  );
}

export function LoadingSection({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: ReactNode;
  title: ReactNode;
  description: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="grid gap-[22px] rounded-[32px] bg-[rgba(9,21,33,0.86)] px-[30px] py-7">
      <SectionIntro eyebrow={eyebrow} title={title} description={description} />
      <LoadingCard>{children}</LoadingCard>
    </section>
  );
}
