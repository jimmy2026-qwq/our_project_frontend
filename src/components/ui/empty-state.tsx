import type { HTMLAttributes, ReactNode } from 'react';

import { cx } from '@/components/ui/cx';

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
    <div
      className={cx(
        'grid gap-2 rounded-[20px] border border-dashed border-[rgba(176,223,229,0.14)] bg-[rgba(255,255,255,0.02)] p-5 text-[#9ab0c1]',
        className,
      )}
      {...props}
    >
      {title ? <strong className="text-[#f2f7fb]">{title}</strong> : null}
      {description ? <p className="m-0 leading-7">{description}</p> : null}
      {children}
    </div>
  );
}
