import { Link, Navigate } from 'react-router-dom';

import { AuthScreenCard } from '../components/AuthScreen/AuthScreenCard';
import { AuthScreenFrame } from '../components/AuthScreen/AuthScreenFrame';
import { AuthScreenIntro } from '../components/AuthScreen/AuthScreenIntro';
import { outlineButtonClassName } from '../components/AuthScreen/AuthScreen.styles';
import { useSuperAdminSetupForm } from './hooks/useSuperAdminSetupForm';

export function SuperAdminSetupPage() {
  const form = useSuperAdminSetupForm();
  const eyebrow = '初始化超管';
  const title = '设置首个超管账号';

  if (form.shouldRedirect) {
    return <Navigate replace to="/public" />;
  }

  return (
    <AuthScreenFrame>
      <AuthScreenIntro
        eyebrow={eyebrow}
        title={title}
        description="第一次部署时，用实体卡密或初始化密钥设置首个 superadmin。完成后就可以用账号密码登录。"
      />
      <AuthScreenCard
        eyebrow={eyebrow}
        title={title}
        description="初始化只允许执行一次。"
        submitLabel="完成初始化"
        footerPrompt="已经有超管账号？"
        footerLinkLabel="去登录"
        footerLinkTo="/login"
        submittingLabel="初始化中..."
        errorMessage={form.errorMessage}
        isSubmitting={form.isSubmitting}
        onSubmit={form.handleSubmit}
        extraActions={
          <Link className={outlineButtonClassName} to="/login">
            返回登录
          </Link>
        }
        fields={form.fields}
      />
    </AuthScreenFrame>
  );
}
