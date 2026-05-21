import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cx } from '@/components/ui/cx';
import { Input } from './input';
import { Select } from './select';
import { Textarea } from './textarea';

const DEFAULT_FIELD_CLASS = '';

export function FieldGroup({
  children,
  className = DEFAULT_FIELD_CLASS,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cx('grid gap-[14px]', className)}>{children}</div>;
}

export function SelectField({
  label,
  children,
  className = DEFAULT_FIELD_CLASS,
  ...props
}: {
  label: ReactNode;
  children: ReactNode;
  className?: string;
} & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <label className={cx('grid gap-2', className)}>
      <span className="leading-7 text-[#9ab0c1]">{label}</span>
      <Select {...props}>{children}</Select>
    </label>
  );
}

export function TextInputField({
  label,
  className = DEFAULT_FIELD_CLASS,
  ...props
}: {
  label: ReactNode;
  className?: string;
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={cx('grid gap-2', className)}>
      <span className="leading-7 text-[#9ab0c1]">{label}</span>
      <Input {...props} />
    </label>
  );
}

export function TextareaField({
  label,
  className = DEFAULT_FIELD_CLASS,
  ...props
}: {
  label: ReactNode;
  className?: string;
} & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className={cx('grid gap-2', className)}>
      <span className="leading-7 text-[#9ab0c1]">{label}</span>
      <Textarea {...props} />
    </label>
  );
}

export function CheckboxField({
  label,
  className,
  ...props
}: {
  label: ReactNode;
  className?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>) {
  return (
    <label className={cx('inline-flex items-center justify-start gap-2', className)}>
      <input type="checkbox" {...props} />
      <span className="text-[#9ab0c1]">{label}</span>
    </label>
  );
}
