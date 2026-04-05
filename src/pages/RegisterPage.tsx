import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import { AuthScreen } from '@/features/auth/components';
import { useAuth, useNotice } from '@/hooks';

function normalizeInput(value: string) {
  return value.trim();
}

export function RegisterPage() {
  const { session, register } = useAuth();
  const { notifySuccess } = useNotice();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (session) {
    return <Navigate replace to="/" />;
  }

  async function handleSubmit() {
    const normalizedDisplayName = normalizeInput(displayName);
    const normalizedUsername = normalizeInput(username);
    const normalizedPassword = normalizeInput(password);
    const normalizedConfirmPassword = normalizeInput(confirmPassword);

    if (!normalizedDisplayName || !normalizedUsername || !normalizedPassword || !normalizedConfirmPassword) {
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

      notifySuccess('注册成功', `账号已创建，当前登录用户为 ${nextSession.user.displayName}。`);
      navigate('/', { replace: true });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '注册失败，请稍后重试。');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthScreen
      eyebrow="Create Account"
      title="创建 RiichiNexus 账号"
      description="页面会优先调用假设存在的 /auth/register。接口不可用时，前端会回退到本地 mock 账户存储，方便你先联调界面。"
      submitLabel="注册"
      footerPrompt="已经有账号了？"
      footerLinkLabel="去登录"
      footerLinkTo="/login"
      errorMessage={errorMessage}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
      fields={[
        {
          id: 'register-display-name',
          label: '显示名称',
          autoComplete: 'nickname',
          placeholder: '请输入显示名称',
          value: displayName,
          onChange: setDisplayName,
        },
        {
          id: 'register-username',
          label: '用户名',
          autoComplete: 'username',
          placeholder: '请输入用户名',
          value: username,
          onChange: setUsername,
        },
        {
          id: 'register-password',
          label: '密码',
          type: 'password',
          autoComplete: 'new-password',
          placeholder: '请输入密码',
          value: password,
          onChange: setPassword,
        },
        {
          id: 'register-confirm-password',
          label: '确认密码',
          type: 'password',
          autoComplete: 'new-password',
          placeholder: '请再次输入密码',
          value: confirmPassword,
          onChange: setConfirmPassword,
        },
      ]}
    />
  );
}
