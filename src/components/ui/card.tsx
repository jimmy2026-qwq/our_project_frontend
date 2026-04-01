import type { HTMLAttributes } from 'react';

import { cx } from '@/lib/cx';

export function Card({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <article
      data-slot="card"
      className={cx(
        'ui-card',
        'flex flex-col rounded-3xl border border-[color:var(--line)] bg-[color:var(--panel)]',
        'shadow-[var(--shadow-md)] backdrop-blur-[18px]',
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="card-header" className={cx('ui-card__header p-[22px]', className)} {...props} />;
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 data-slot="card-title" className={cx('ui-card__title m-0', className)} {...props} />;
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      data-slot="card-description"
      className={cx('ui-card__description mt-2 mb-0 text-[color:var(--muted)] leading-7', className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="card-content" className={cx('ui-card__content p-[22px]', className)} {...props} />;
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="card-footer" className={cx('ui-card__footer p-[22px]', className)} {...props} />;
}
