import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cx } from '@/components/shared/utils';

const DEFAULT_FIELD_CLASS = 'shared-field';

export function FieldGroup({
  children,
  className = DEFAULT_FIELD_CLASS,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cx(className)}>{children}</div>;
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
    <label className={className}>
      <span>{label}</span>
      <select {...props}>{children}</select>
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
    <label className={className}>
      <span>{label}</span>
      <input {...props} />
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
    <label className={className}>
      <span>{label}</span>
      <textarea {...props} />
    </label>
  );
}

export function CheckboxField({
  label,
  className = 'portal-checkbox',
  ...props
}: {
  label: ReactNode;
  className?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>) {
  return (
    <label className={cx(className)}>
      <input type="checkbox" {...props} />
      <span>{label}</span>
    </label>
  );
}
