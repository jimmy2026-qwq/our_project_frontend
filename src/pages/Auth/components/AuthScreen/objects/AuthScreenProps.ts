import type { ReactNode } from 'react';

import type { AuthField } from './AuthField';

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
