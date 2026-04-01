import type { HTMLAttributes, ReactNode } from 'react';

import { cx } from '@/lib/cx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function InfoCard({
  title,
  description,
  aside,
  className,
  children,
}: Omit<HTMLAttributes<HTMLElement>, 'title'> & {
  title: ReactNode;
  description?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <Card className={cx('ui-info-card', className)}>
      <CardHeader className="ui-info-card__header pb-0">
        <div className="ui-info-card__head flex items-start justify-between gap-4">
          <div>
            <CardTitle className="ui-info-card__title mb-2">{title}</CardTitle>
            {description ? <p className="ui-info-card__description text-[color:var(--muted)] leading-7">{description}</p> : null}
          </div>
          {aside}
        </div>
      </CardHeader>
      <CardContent className="ui-info-card__content pt-4">{children}</CardContent>
    </Card>
  );
}
