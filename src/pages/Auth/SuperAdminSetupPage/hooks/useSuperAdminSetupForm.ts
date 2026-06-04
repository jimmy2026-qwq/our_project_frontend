import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/app/auth/useAuth';
import { useNotice } from '@/app/feedback/useNotice';

import { normalizeAuthInput } from '../../functions/normalizeAuthInput';

function mapSuperAdminSetupError(error: unknown) {
  const message = error instanceof Error ? error.message : '';
  const normalized = message.toLowerCase();

  if (
    normalized.includes('invalid super admin bootstrap key') ||
    normalized.includes('invalid_bootstrap_key')
  ) {
    return '初始化卡密不正确。';
  }

  if (normalized.includes('super admin has already been initialized')) {
    return '系统已经初始化过超管账号，请用已有超管账号登录。';
  }

  if (normalized.includes('password must be at least 8 characters')) {
    return '密码至少需要 8 位。';
  }

  if (normalized.includes('already registered')) {
    return '这个账号已经被注册。';
  }

  if (normalized.includes('display name is required')) {
    return '请填写昵称。';
  }

  if (normalized.includes('username is required')) {
    return '请填写账号。';
  }

  if (normalized.includes('super admin bootstrap key is not configured')) {
    return '超管初始化卡密尚未配置，请先设置 RIICHI_SUPERADMIN_BOOTSTRAP_KEY。';
  }

  return message || '超管初始化失败，请稍后重试。';
}

export function useSuperAdminSetupForm() {
  const { isReady, session, bootstrapSuperAdmin } = useAuth();
  const { notifySuccess } = useNotice();
  const navigate = useNavigate();
  const [bootstrapKey, setBootstrapKey] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    const normalizedBootstrapKey = normalizeAuthInput(bootstrapKey);
    const normalizedDisplayName = normalizeAuthInput(displayName);
    const normalizedUsername = normalizeAuthInput(username);
    const normalizedPassword = normalizeAuthInput(password);
    const normalizedConfirmPassword = normalizeAuthInput(confirmPassword);

    if (
      !normalizedBootstrapKey ||
      !normalizedDisplayName ||
      !normalizedUsername ||
      !normalizedPassword ||
      !normalizedConfirmPassword
    ) {
      setErrorMessage('请完整填写超管初始化信息。');
      return;
    }

    if (normalizedPassword !== normalizedConfirmPassword) {
      setErrorMessage('两次输入的密码不一致。');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const nextSession = await bootstrapSuperAdmin({
        bootstrapKey: normalizedBootstrapKey,
        displayName: normalizedDisplayName,
        username: normalizedUsername,
        password: normalizedPassword,
      });

      notifySuccess('超管初始化完成', '欢迎你，' + nextSession.user.displayName + '。');
      navigate('/public', { replace: true });
    } catch (error) {
      setErrorMessage(mapSuperAdminSetupError(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    errorMessage,
    fields: [
      {
        id: 'setup-superadmin-bootstrap-key',
        label: '初始化卡密',
        type: 'password' as const,
        autoComplete: 'one-time-code',
        placeholder: '请输入实体卡密或初始化密钥',
        value: bootstrapKey,
        onChange: setBootstrapKey,
      },
      {
        id: 'setup-superadmin-display-name',
        label: '昵称',
        autoComplete: 'nickname',
        placeholder: '请输入昵称',
        value: displayName,
        onChange: setDisplayName,
      },
      {
        id: 'setup-superadmin-username',
        label: '账号',
        autoComplete: 'username',
        placeholder: '请输入账号',
        value: username,
        onChange: setUsername,
      },
      {
        id: 'setup-superadmin-password',
        label: '密码',
        type: 'password' as const,
        autoComplete: 'new-password',
        placeholder: '请设置至少 8 位密码',
        value: password,
        onChange: setPassword,
      },
      {
        id: 'setup-superadmin-confirm-password',
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
    shouldRedirect: isReady && !!session?.user.roles.isSuperAdmin,
  };
}
