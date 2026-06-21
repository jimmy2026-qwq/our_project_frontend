import { inputClassName } from './AuthScreen.styles';
import type { AuthField } from './AuthScreen.types';

interface AuthFieldInputProps {
  field: AuthField;
}

/** 根据认证字段配置渲染对应的输入框。 */
export function AuthFieldInput({ field }: AuthFieldInputProps) {
  return (
    <label htmlFor={field.id} className="grid gap-2">
      <span className="text-sm font-medium text-[#f2f7fb]">{field.label}</span>
      <input
        id={field.id}
        type={field.type ?? 'text'}
        autoComplete={field.autoComplete}
        className={inputClassName}
        placeholder={field.placeholder}
        value={field.value}
        onChange={(event) => field.onChange(event.target.value)}
      />
    </label>
  );
}
