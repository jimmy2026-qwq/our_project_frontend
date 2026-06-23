import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { CreateGuestSessionAuthAPI, CurrentSessionAuthAPI, LoginAuthAPI } from '@/api/auth';
import { mapGuestSession } from '@/app/auth/functions/mapAuthSession';
import { resolveAuthenticatedAuthSession } from '@/app/auth/functions/resolveAuthenticatedAuthSession';
import { useAuthContext } from '@/app/auth/useAuthContext';
import { useNotice } from '@/app/feedback/useNotice';
import { sendAPI } from '@/system/api';

import { normalizeAuthInput } from '../../functions/normalizeAuthInput';

export function useLoginPageForm() {
  const { isReady, session, saveSession } = useAuthContext();
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
    const normalizedUsername = normalizeAuthInput(username);
    const normalizedPassword = normalizeAuthInput(password);

    if (!normalizedUsername || !normalizedPassword) {
      setErrorMessage('请输入账号和密码。');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const loginResult = await sendAPI(
        LoginAuthAPI.fromRequest({
          username: normalizedUsername,
          password: normalizedPassword,
        }),
      );
      const nextSession = await resolveAuthenticatedAuthSession(
        loginResult.token,
      );
      saveSession(nextSession);

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
      const guestSession = await sendAPI(
        new CreateGuestSessionAuthAPI({ displayName: 'Guest' }),
      );
      const currentSession = await sendAPI(
        new CurrentSessionAuthAPI({ guestSessionId: guestSession.id }),
      );
      saveSession(mapGuestSession(currentSession));
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
