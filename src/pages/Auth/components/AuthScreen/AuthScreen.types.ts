import type { ReactNode } from 'react';

export interface AuthField {
  id: string;
  label: string;
  type?: 'text' | 'password';
  autoComplete?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

export interface AuthScreenProps {
  eyebrow: string;
  title: string;
  description?: string;
  submitLabel: string;
  submittingLabel?: string;
  footerPrompt: string;
  footerLinkLabel: string;
  footerLinkTo: string;
  fields: AuthField[];
  errorMessage: string;
  isSubmitting: boolean;
  onSubmit: () => void;
  secondaryAction?: {
    label: string;
    disabled?: boolean;
    onClick: () => void;
  };
  extraActions?: ReactNode;
}
