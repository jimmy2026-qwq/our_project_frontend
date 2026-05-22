import { Navigate } from 'react-router-dom';

import { AuthScreen } from '../components/AuthScreen';
import { useRegisterPageForm } from './hooks';

export function RegisterPage() {
  const form = useRegisterPageForm();

  if (form.shouldRedirect) {
    return <Navigate replace to="/" />;
  }

  return (
    <AuthScreen
      eyebrow="创建账号"
      title="RiichiNexus 账号注册"
      submitLabel="注册"
      footerPrompt="已有账号？"
      footerLinkLabel="去登录"
      footerLinkTo="/login"
      submittingLabel="注册中..."
      errorMessage={form.errorMessage}
      isSubmitting={form.isSubmitting}
      onSubmit={form.handleSubmit}
      fields={form.fields}
    />
  );
}
