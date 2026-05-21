import type { TextareaHTMLAttributes } from 'react';

import { cx } from '@/components/ui/cx';

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      data-slot="textarea"
      className={cx(
        'flex min-h-[132px] w-full rounded-[14px] border border-[rgba(176,223,229,0.14)]',
        'bg-[rgba(5,14,23,0.88)] px-3.5 py-3 [font-family:"JetBrains_Sans","Segoe_UI",sans-serif] text-[#f2f7fb]',
        'shadow-xs outline-none transition-[transform,border-color,background-color,box-shadow,color,opacity] duration-200',
        'placeholder:text-[#9ab0c1] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-55',
        'focus-visible:border-[rgba(114,216,209,0.36)] focus-visible:shadow-[0_0_0_3px_rgba(114,216,209,0.12)]',
        'focus-visible:outline-none hover:enabled:-translate-y-px resize-y',
        className,
      )}
      {...props}
    />
  );
}
