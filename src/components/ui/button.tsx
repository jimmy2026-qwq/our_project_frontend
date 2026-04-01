import { forwardRef, type ButtonHTMLAttributes } from 'react';

import { cva, cx, type VariantProps } from '@/lib/cx';

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap',
    'font-medium text-[color:var(--text)] no-underline',
    'border border-[color:var(--line)]',
    'transition-[transform,border-color,background-color,box-shadow,color,opacity] duration-200',
    'disabled:pointer-events-none disabled:opacity-55',
    'focus-visible:outline-none focus-visible:border-[rgba(114,216,209,0.36)]',
    'focus-visible:shadow-[0_0_0_3px_rgba(114,216,209,0.12)]',
    'hover:enabled:-translate-y-px',
  ].join(' '),
  {
    variants: {
      variant: {
        default: 'rounded-2xl border-[rgba(114,216,209,0.28)] bg-[rgba(5,14,23,0.88)]',
        secondary: 'rounded-2xl border-[rgba(236,197,122,0.24)] bg-[rgba(5,14,23,0.88)]',
        outline: 'rounded-2xl bg-[rgba(255,255,255,0.03)]',
        ghost: 'rounded-2xl border-transparent bg-transparent',
        danger: 'rounded-2xl border-[rgba(236,197,122,0.4)] bg-[rgba(5,14,23,0.88)] text-[color:var(--gold)]',
        chip: 'rounded-full bg-[rgba(5,14,23,0.88)]',
        tab: [
          'grid w-full justify-items-start gap-2 rounded-[24px] p-5 text-left',
          'bg-[rgba(9,22,33,0.7)]',
          '[&_strong]:block [&_span]:block',
        ].join(' '),
      },
      size: {
        sm: 'min-h-[34px] px-3 py-2 text-[0.9rem]',
        md: 'min-h-[42px] px-4 py-2.5',
        lg: 'min-h-12 px-5 py-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
    compoundVariants: [
      {
        variant: 'tab',
        size: 'sm',
        className: 'min-h-0 p-4',
      },
      {
        variant: 'tab',
        size: 'md',
        className: 'min-h-0 p-5',
      },
      {
        variant: 'tab',
        size: 'lg',
        className: 'min-h-0 p-6',
      },
    ],
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    variant = 'default',
    size = 'md',
    type = 'button',
    ...props
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      data-slot="button"
      className={cx('ui-button', buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
});
