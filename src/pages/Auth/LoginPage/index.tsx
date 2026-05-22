import { Navigate } from 'react-router-dom';

import { AuthScreen } from '../components/AuthScreen';
import { useLoginPageForm } from './hooks';

export function LoginPage() {
  const form = useLoginPageForm();

  if (form.shouldRedirect) {
    return <Navigate replace to="/public" />;
  }

  return (
    <AuthScreen
      eyebrow="账号登录"
      title="RiichiNexus 账号登录"
      submitLabel="登录"
      footerPrompt="还没有账号？"
      footerLinkLabel="立即注册"
      footerLinkTo="/register"
      submittingLabel="登录中..."
      errorMessage={form.errorMessage}
      isSubmitting={form.isSubmitting}
      onSubmit={form.handleSubmit}
      secondaryAction={{
        label: '游客进入',
        disabled: form.isSubmitting,
        onClick: () => void form.handleGuestEnter(),
      }}
      fields={form.fields}
    />
  );
}
