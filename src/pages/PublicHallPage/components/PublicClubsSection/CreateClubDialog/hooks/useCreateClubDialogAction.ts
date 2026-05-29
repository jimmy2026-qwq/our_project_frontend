import { type ChangeEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { CreateClubAPI } from '@/api/club';
import { useAuth } from '@/app/auth/useAuth';
import { useNotice } from '@/app/feedback/useNotice';
import { sendAPI } from '@/system/api';

import { toPublicClubSummary } from '../../../../objects/PublicHall.mappers';

export function useCreateClubDialogAction({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { notifySuccess, notifyWarning } = useNotice();
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const operatorId = session?.user.operatorId ?? session?.user.userId;
  const canCreate =
    !!session?.user.roles.isRegisteredPlayer &&
    !!operatorId &&
    name.trim().length > 0 &&
    !isSubmitting;

  function reset() {
    setName('');
    setIsSubmitting(false);
  }

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open]);

  function handleNameChange(event: ChangeEvent<HTMLInputElement>) {
    setName(event.currentTarget.value);
  }

  function handleCancel() {
    onOpenChange(false);
  }

  async function handleSubmit() {
    if (!session?.user.roles.isRegisteredPlayer || !operatorId) {
      notifyWarning('无法创建俱乐部', '当前账号没有创建俱乐部所需的权限。');
      return;
    }

    const trimmedName = name.trim();
    if (!trimmedName) {
      notifyWarning('请填写俱乐部名称', '俱乐部名称不能为空。');
      return;
    }

    try {
      setIsSubmitting(true);
      const created = await sendAPI(
        new CreateClubAPI({
          name: trimmedName,
          creatorId: operatorId,
        }),
      ).then(toPublicClubSummary);
      notifySuccess(
        '俱乐部已创建',
        `${created.name} 已创建，当前账号已被设为俱乐部管理员。`,
      );
      onOpenChange(false);
      navigate(`/public/clubs/${created.id}`);
    } catch (error) {
      notifyWarning(
        '创建俱乐部失败',
        error instanceof Error ? error.message : '创建俱乐部时发生未知错误。',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    canCreate,
    creatorName: session?.user.displayName ?? '',
    handleCancel,
    handleNameChange,
    handleSubmit,
    isSubmitting,
    name,
    reset,
  };
}
