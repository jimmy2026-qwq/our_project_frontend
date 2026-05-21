import type { HTMLAttributes, ReactNode } from 'react';

import { cx } from '@/components/ui/cx';

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
    <div
      className={cx(
        'grid gap-2 rounded-[18px] border border-[rgba(176,223,229,0.14)] bg-[rgba(255,255,255,0.03)] p-[18px]',
        'bg-[radial-gradient(circle_at_top_right,rgba(236,197,122,0.08),transparent_38%)]',
        className,
      )}
      {...props}
    >
      <strong className="block">{title}</strong>
      {description ? <p className="m-0 leading-[1.7] text-[#9ab0c1]">{description}</p> : null}
      {children}
    </div>
  );
}
