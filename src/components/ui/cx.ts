import { cva, type VariantProps } from 'class-variance-authority';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cx(...parts: ClassValue[]) {
  return twMerge(clsx(parts));
}

export { cva };
export type { VariantProps };
