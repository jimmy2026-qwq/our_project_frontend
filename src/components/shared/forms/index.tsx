import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cx } from '@/lib/cx';
import { Input, Select, Textarea } from '@/components/ui';

const DEFAULT_FIELD_CLASS = 'shared-field';

export function FieldGroup({
  children,
  className = DEFAULT_FIELD_CLASS,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cx('grid gap-[14px]', className === DEFAULT_FIELD_CLASS ? undefined : className)}>{children}</div>;
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
    <label className={cx('grid gap-2', className === DEFAULT_FIELD_CLASS ? undefined : className)}>
      <span className="leading-7 text-[color:var(--muted)]">{label}</span>
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
    <label className={cx('grid gap-2', className === DEFAULT_FIELD_CLASS ? undefined : className)}>
      <span className="leading-7 text-[color:var(--muted)]">{label}</span>
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
    <label className={cx('grid gap-2', className === DEFAULT_FIELD_CLASS ? undefined : className)}>
      <span className="leading-7 text-[color:var(--muted)]">{label}</span>
      <Textarea {...props} />
    </label>
  );
}

export function CheckboxField({
  label,
  className = 'shared-checkbox-field',
  ...props
}: {
  label: ReactNode;
  className?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>) {
  return (
    <label className={cx('shared-checkbox-field inline-flex items-center justify-start gap-2', className)}>
      <input type="checkbox" {...props} />
      <span className="text-[color:var(--muted)]">{label}</span>
    </label>
  );
}
