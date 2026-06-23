export interface AuthField {
  id: string;
  label: string;
  type?: 'text' | 'password';
  autoComplete?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}
