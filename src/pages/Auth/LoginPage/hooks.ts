import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '@/app/auth/useAuth';
import { useNotice } from '@/app/feedback/useNotice';

function normalizeInput(value: string) {
  return value.trim();
}

export function useLoginPageForm() {
  const { isReady, session, login, enterGuestMode } = useAuth();
  const { notifyInfo, notifySuccess } = useNotice();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasRegisteredSession =
    !!session &&
    session.user.roles.isRegisteredPlayer &&
    !session.user.roles.isGuest;

  async function handleSubmit() {
    const normalizedUsername = normalizeInput(username);
    const normalizedPassword = normalizeInput(password);

    if (!normalizedUsername || !normalizedPassword) {
      setErrorMessage('请输入账号和密码。');
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

      const from =
        (location.state as { from?: string } | null)?.from ?? '/public';
      navigate(from, { replace: true });
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : '登录失败，请稍后重试。',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGuestEnter() {
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await enterGuestMode('Guest');
      notifyInfo(
        '已进入游客模式',
        '你可以先浏览公共大厅，登录后再进行完整操作。',
      );
      navigate('/public', { replace: true });
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : '进入游客模式失败，请稍后重试。',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    errorMessage,
    fields: [
      {
        id: 'login-username',
        label: '账号',
        autoComplete: 'username',
        placeholder: '请输入账号',
        value: username,
        onChange: setUsername,
      },
      {
        id: 'login-password',
        label: '密码',
        type: 'password' as const,
        autoComplete: 'current-password',
        placeholder: '请输入密码',
        value: password,
        onChange: setPassword,
      },
    ],
    handleGuestEnter,
    handleSubmit,
    isSubmitting,
    shouldRedirect: isReady && hasRegisteredSession,
  };
}
