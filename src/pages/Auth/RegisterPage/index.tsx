import { Navigate } from 'react-router-dom';

import { AuthScreenCard } from '../components/AuthScreen/AuthScreenCard';
import { AuthScreenFrame } from '../components/AuthScreen/AuthScreenFrame';
import { AuthScreenIntro } from '../components/AuthScreen/AuthScreenIntro';
import { useRegisterPageForm } from './hooks/useRegisterPageForm';

/** 注册正式账号并创建玩家展示身份的页面。 */
export function RegisterPage() {
  const form = useRegisterPageForm();
  const eyebrow = '创建账号';
  const title = 'RiichiNexus 账号注册';

  if (form.shouldRedirect) {
    return <Navigate replace to="/" />;
  }

  return (
    <AuthScreenFrame>
      <AuthScreenIntro eyebrow={eyebrow} title={title} />
      <AuthScreenCard
        eyebrow={eyebrow}
        title={title}
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
    </AuthScreenFrame>
  );
}
