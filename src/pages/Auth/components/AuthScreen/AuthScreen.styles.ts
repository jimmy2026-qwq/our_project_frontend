import { cx } from '@/components/ui/cx';

export const inputClassName = [
  'flex min-h-11 w-full min-w-0 rounded-[14px] border border-[rgba(176,223,229,0.14)]',
  'bg-[rgba(5,14,23,0.88)] px-3.5 py-[11px] text-[#f2f7fb] [color-scheme:dark]',
  'shadow-xs outline-none transition-[transform,border-color,background-color,box-shadow,color,opacity] duration-200',
  'placeholder:text-[#9ab0c1] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-55',
  '[&:-webkit-autofill]:[-webkit-text-fill-color:#f2f7fb] [&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_rgba(5,14,23,0.88)]',
  '[&:-webkit-autofill:focus]:[-webkit-text-fill-color:#f2f7fb] [&:-webkit-autofill:focus]:shadow-[inset_0_0_0_1000px_rgba(5,14,23,0.88),0_0_0_3px_rgba(114,216,209,0.12)]',
  'focus-visible:border-[rgba(114,216,209,0.36)] focus-visible:shadow-[0_0_0_3px_rgba(114,216,209,0.12)]',
  'focus-visible:outline-none hover:enabled:-translate-y-px',
].join(' ');

const buttonBaseClassName = [
  'inline-flex min-h-12 items-center justify-center gap-2 whitespace-nowrap rounded-2xl border px-5 py-3',
  'font-medium text-[#f2f7fb] no-underline transition-[transform,border-color,background-color,box-shadow,color,opacity] duration-200',
  'disabled:pointer-events-none disabled:opacity-55',
  'focus-visible:border-[rgba(114,216,209,0.36)] focus-visible:shadow-[0_0_0_3px_rgba(114,216,209,0.12)] focus-visible:outline-none',
  'hover:enabled:-translate-y-px',
].join(' ');

export const primaryButtonClassName = cx(
  buttonBaseClassName,
  'border-[rgba(114,216,209,0.28)] bg-[rgba(5,14,23,0.88)]',
);

export const outlineButtonClassName = cx(
  buttonBaseClassName,
  'border-[rgba(176,223,229,0.14)] bg-[rgba(255,255,255,0.03)]',
);
