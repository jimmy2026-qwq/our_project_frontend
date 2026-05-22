import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/app/auth/useAuth';
import { useNotice } from '@/app/feedback/useNotice';

function normalizeInput(value: string) {
  return value.trim();
}

export function useRegisterPageForm() {
  const { isReady, session, register } = useAuth();
  const { notifySuccess } = useNotice();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasRegisteredSession =
    !!session &&
    session.user.roles.isRegisteredPlayer &&
    !session.user.roles.isGuest;

  async function handleSubmit() {
    const normalizedDisplayName = normalizeInput(displayName);
    const normalizedUsername = normalizeInput(username);
    const normalizedPassword = normalizeInput(password);
    const normalizedConfirmPassword = normalizeInput(confirmPassword);

    if (
      !normalizedDisplayName ||
      !normalizedUsername ||
      !normalizedPassword ||
      !normalizedConfirmPassword
    ) {
      setErrorMessage('请完整填写注册信息。');
      return;
    }

    if (normalizedPassword !== normalizedConfirmPassword) {
      setErrorMessage('两次输入的密码不一致。');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const nextSession = await register({
        displayName: normalizedDisplayName,
        username: normalizedUsername,
        password: normalizedPassword,
      });

      notifySuccess('注册成功', `欢迎你，${nextSession.user.displayName}。`);
      navigate('/', { replace: true });
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : '注册失败，请稍后重试。',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    errorMessage,
    fields: [
      {
        id: 'register-display-name',
        label: '昵称',
        autoComplete: 'nickname',
        placeholder: '请输入昵称',
        value: displayName,
        onChange: setDisplayName,
      },
      {
        id: 'register-username',
        label: '账号',
        autoComplete: 'username',
        placeholder: '请输入账号',
        value: username,
        onChange: setUsername,
      },
      {
        id: 'register-password',
        label: '密码',
        type: 'password' as const,
        autoComplete: 'new-password',
        placeholder: '请输入密码',
        value: password,
        onChange: setPassword,
      },
      {
        id: 'register-confirm-password',
        label: '确认密码',
        type: 'password' as const,
        autoComplete: 'new-password',
        placeholder: '请再次输入密码',
        value: confirmPassword,
        onChange: setConfirmPassword,
      },
    ],
    handleSubmit,
    isSubmitting,
    shouldRedirect: isReady && hasRegisteredSession,
  };
}
