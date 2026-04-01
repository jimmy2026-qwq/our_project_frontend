import type { HTMLAttributes, ReactNode } from 'react';

import { cx } from '@/lib/cx';

export function EmptyStateBlock({
  title,
  description,
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  title?: ReactNode;
  description?: ReactNode;
}) {
  return (
    <div className={cx('ui-empty-state', className)} {...props}>
      {title ? <strong className="ui-empty-state__title">{title}</strong> : null}
      {description ? <p className="ui-empty-state__description">{description}</p> : null}
      {children}
    </div>
  );
}
