import { Link, Navigate } from 'react-router-dom';

import { AuthScreenCard } from '../components/AuthScreen/AuthScreenCard';
import { AuthScreenFrame } from '../components/AuthScreen/AuthScreenFrame';
import { AuthScreenIntro } from '../components/AuthScreen/AuthScreenIntro';
import { outlineButtonClassName } from '../components/AuthScreen/AuthScreen.styles';
import { useLoginPageForm } from './hooks/useLoginPageForm';

export function LoginPage() {
  const form = useLoginPageForm();
  const eyebrow = '账号登录';
  const title = 'RiichiNexus 账号登录';

  if (form.shouldRedirect) {
    return <Navigate replace to="/public" />;
  }

  return (
    <AuthScreenFrame>
      <AuthScreenIntro eyebrow={eyebrow} title={title} />
      <AuthScreenCard
        eyebrow={eyebrow}
        title={title}
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
        extraActions={
          <Link className={outlineButtonClassName} to="/setup-superadmin">
            初始化超管
          </Link>
        }
        fields={form.fields}
      />
    </AuthScreenFrame>
  );
}
