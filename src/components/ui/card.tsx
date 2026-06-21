import type { HTMLAttributes } from 'react';

import { cx } from '@/components/ui/cx';

/** 提供后台和公开页通用的玻璃质感内容卡片容器。 */
export function Card({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <article
      data-slot="card"
      className={cx(
        'flex flex-col rounded-3xl border border-[rgba(176,223,229,0.14)] bg-[rgba(14,31,46,0.78)] text-[#f2f7fb]',
        'shadow-[0_18px_48px_rgba(0,0,0,0.22)] backdrop-blur-[18px]',
        '[&_[data-slot=card-header]+[data-slot=card-content]]:pt-0',
        '[&_[data-slot=card-content]+[data-slot=card-footer]]:pt-0',
        className,
      )}
      {...props}
    />
  );
}

/** 卡片顶部标题区容器。 */
export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="card-header" className={cx('p-[22px]', className)} {...props} />;
}

/** 卡片主标题文本。 */
export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 data-slot="card-title" className={cx('m-0 text-[#f2f7fb]', className)} {...props} />;
}

/** 卡片标题下方的辅助说明文本。 */
export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      data-slot="card-description"
      className={cx('mt-2 mb-0 leading-7 text-[#9ab0c1]', className)}
      {...props}
    />
  );
}

/** 卡片主体内容区。 */
export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="card-content" className={cx('p-[22px]', className)} {...props} />;
}

/** 卡片底部操作区。 */
export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="card-footer" className={cx('p-[22px]', className)} {...props} />;
}
