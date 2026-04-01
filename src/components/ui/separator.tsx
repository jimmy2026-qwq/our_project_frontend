import type { HTMLAttributes } from 'react';

import { cx } from '@/lib/cx';

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
        'ui-separator',
        orientation === 'vertical'
          ? 'ui-separator--vertical h-full w-px shrink-0 bg-[color:var(--line)]'
          : 'ui-separator--horizontal h-px w-full shrink-0 bg-[color:var(--line)]',
        className,
      )}
      {...props}
    />
  );
}
