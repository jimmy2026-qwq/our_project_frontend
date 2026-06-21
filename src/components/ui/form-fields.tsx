import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cx } from '@/components/ui/cx';
import { Input } from './input';
import { Select } from './select';
import { Textarea } from './textarea';

const DEFAULT_FIELD_CLASS = '';

/** 表单字段组的纵向间距容器。 */
export function FieldGroup({
  children,
  className = DEFAULT_FIELD_CLASS,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cx('grid gap-[14px]', className)}>{children}</div>;
}

/** 带标签的下拉选择字段。 */
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

/** 带标签的单行文本输入字段。 */
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

/** 带标签的多行文本输入字段。 */
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

/** 带标签的复选框字段。 */
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
