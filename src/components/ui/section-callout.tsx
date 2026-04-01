import type { HTMLAttributes, ReactNode } from 'react';

import { cx } from '@/lib/cx';

export function SectionCallout({
  title,
  description,
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  title: ReactNode;
  description?: ReactNode;
}) {
  return (
    <div className={cx('ui-section-callout', className)} {...props}>
      <strong className="ui-section-callout__title">{title}</strong>
      {description ? <p className="ui-section-callout__description">{description}</p> : null}
      {children}
    </div>
  );
}
