import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui';
import { AuthScreen } from '@/features/auth/components';
import { useAuth, useNotice } from '@/hooks';

function normalizeInput(value: string) {
  return value.trim();
}

export function LoginPage() {
  const { session, login, enterGuestMode } = useAuth();
  const { notifyInfo, notifySuccess } = useNotice();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (session) {
    return <Navigate replace to={session.user.roles.isGuest ? '/public' : '/'} />;
  }

  async function handleSubmit() {
    const normalizedUsername = normalizeInput(username);
    const normalizedPassword = normalizeInput(password);

    if (!normalizedUsername || !normalizedPassword) {
      setErrorMessage('请输入用户名和密码。');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const nextSession = await login({
        username: normalizedUsername,
        password: normalizedPassword,
      });

      notifySuccess('登录成功', `欢迎回来，${nextSession.user.displayName}。`);

      const from = (location.state as { from?: string } | null)?.from ?? '/';
      navigate(from, { replace: true });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '登录失败，请稍后重试。');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGuestEnter() {
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await enterGuestMode('Guest');
      notifyInfo('已进入游客模式', '当前可访问公共大厅和现有详情页。');
      navigate('/public', { replace: true });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '进入游客模式失败，请稍后重试。');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthScreen
      eyebrow="Member Access"
      title="登录 RiichiNexus 工作台"
      description="页面会优先调用假设存在的 /auth/login 与 /auth/session。接口不可用时自动回退到本地 mock；当前可用示例账号为 123 / 456。"
      submitLabel="登录"
      footerPrompt="还没有账号？"
      footerLinkLabel="创建一个"
      footerLinkTo="/register"
      errorMessage={errorMessage}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
      extraActions={
        <Button variant="outline" size="lg" disabled={isSubmitting} onClick={() => void handleGuestEnter()}>
          游客模式进入
        </Button>
      }
      fields={[
        {
          id: 'login-username',
          label: '用户名',
          autoComplete: 'username',
          placeholder: '请输入用户名',
          value: username,
          onChange: setUsername,
        },
        {
          id: 'login-password',
          label: '密码',
          type: 'password',
          autoComplete: 'current-password',
          placeholder: '请输入密码',
          value: password,
          onChange: setPassword,
        },
      ]}
    />
  );
}
