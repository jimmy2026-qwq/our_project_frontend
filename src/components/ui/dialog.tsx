import { forwardRef, type ComponentPropsWithoutRef, type ElementRef, type HTMLAttributes } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';

import { cx } from '@/components/ui/cx';

/** Radix Dialog 根组件的项目内导出。 */
export const Dialog = DialogPrimitive.Root;
/** Radix Dialog Portal 的项目内导出。 */
export const DialogPortal = DialogPrimitive.Portal;

/** 弹窗打开时覆盖页面的半透明背景层。 */
export const DialogOverlay = forwardRef<
  ElementRef<typeof DialogPrimitive.Overlay>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(function DialogOverlay({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Overlay
      ref={ref}
      data-slot="dialog-overlay"
      className={cx(
        'fixed inset-0 z-30 bg-[rgba(3,8,14,0.62)] backdrop-blur-[8px]',
        className,
      )}
      {...props}
    />
  );
});

/** 弹窗内容面板，统一尺寸、圆角、边框和背景。 */
export const DialogSurface = forwardRef<
  ElementRef<typeof DialogPrimitive.Content>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(function DialogSurface({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Content
      ref={ref}
      data-slot="dialog-surface"
      className={cx(
        'fixed left-1/2 top-1/2 z-30 grid w-[min(460px,calc(100%-40px))] -translate-x-1/2 -translate-y-1/2 gap-2 rounded-[28px]',
        'border border-[rgba(176,223,229,0.14)] bg-[rgba(8,18,29,0.96)]',
        'shadow-[0_32px_90px_rgba(0,0,0,0.34)] backdrop-blur-[18px]',
        className,
      )}
      {...props}
    />
  );
});

/** 弹窗标题区域布局容器。 */
export function DialogHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="dialog-header" className={cx('grid gap-2.5', className)} {...props} />;
}

/** 弹窗主体内容区域布局容器。 */
export function DialogBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="dialog-body" className={cx('grid gap-2.5', className)} {...props} />;
}

/** 弹窗底部按钮和辅助操作区域。 */
export function DialogFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="dialog-footer" className={cx('grid gap-2.5', className)} {...props} />;
}

/** 弹窗无障碍标题文本。 */
export const DialogTitle = forwardRef<
  ElementRef<typeof DialogPrimitive.Title>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(function DialogTitle({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Title
      ref={ref}
      data-slot="dialog-title"
      className={cx('m-0 text-[#f2f7fb]', className)}
      {...props}
    />
  );
});

/** 弹窗无障碍描述文本。 */
export const DialogDescription = forwardRef<
  ElementRef<typeof DialogPrimitive.Description>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(function DialogDescription({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Description
      ref={ref}
      data-slot="dialog-description"
      className={cx('m-0 leading-[1.75] text-[#9ab0c1]', className)}
      {...props}
    />
  );
});
