import { forwardRef, type ComponentPropsWithoutRef, type ElementRef, type HTMLAttributes } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';

import { cx } from '@/lib/cx';

export const Dialog = DialogPrimitive.Root;
export const DialogPortal = DialogPrimitive.Portal;

export const DialogOverlay = forwardRef<
  ElementRef<typeof DialogPrimitive.Overlay>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(function DialogOverlay({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Overlay
      ref={ref}
      data-slot="dialog-overlay"
      className={cx(
        'ui-dialog-overlay fixed inset-0 z-30 bg-[rgba(3,8,14,0.62)] backdrop-blur-[8px]',
        className,
      )}
      {...props}
    />
  );
});

export const DialogSurface = forwardRef<
  ElementRef<typeof DialogPrimitive.Content>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(function DialogSurface({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Content
      ref={ref}
      data-slot="dialog-surface"
      className={cx(
        'ui-dialog-surface fixed left-1/2 top-1/2 z-30 grid w-[calc(100%-40px)] max-w-[460px] -translate-x-1/2 -translate-y-1/2 gap-2 rounded-[28px]',
        'border border-[color:var(--line)] bg-[rgba(8,18,29,0.96)]',
        'shadow-[var(--shadow-lg)] backdrop-blur-[18px]',
        className,
      )}
      {...props}
    />
  );
});

export function DialogHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="dialog-header" className={cx('ui-dialog-header grid gap-2', className)} {...props} />;
}

export function DialogBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="dialog-body" className={cx('ui-dialog-body grid gap-2', className)} {...props} />;
}

export function DialogFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="dialog-footer" className={cx('ui-dialog-footer grid gap-2', className)} {...props} />;
}

export const DialogTitle = forwardRef<
  ElementRef<typeof DialogPrimitive.Title>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(function DialogTitle({ className, ...props }, ref) {
  return <DialogPrimitive.Title ref={ref} data-slot="dialog-title" className={cx('ui-dialog-title m-0', className)} {...props} />;
});

export const DialogDescription = forwardRef<
  ElementRef<typeof DialogPrimitive.Description>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(function DialogDescription({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Description
      ref={ref}
      data-slot="dialog-description"
      className={cx('ui-dialog-description m-0 text-[color:var(--muted)] leading-7', className)}
      {...props}
    />
  );
});
