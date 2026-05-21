import type { HTMLAttributes } from 'react';

import { cx } from '@/components/ui/cx';

export function Separator({
  className,
  orientation = 'horizontal',
  decorative = true,
  ...props
}: HTMLAttributes<HTMLDivElement> & { orientation?: 'horizontal' | 'vertical'; decorative?: boolean }) {
  return (
    <div
      data-slot="separator"
      role={decorative ? 'presentation' : 'separator'}
      aria-orientation={orientation}
      className={cx(
        orientation === 'vertical'
          ? 'h-full w-px shrink-0 bg-[rgba(176,223,229,0.14)]'
          : 'h-px w-full shrink-0 bg-[rgba(176,223,229,0.14)]',
        className,
      )}
      {...props}
    />
  );
}
