import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { clubsApi } from '@/api/clubs';
import { FieldGroup, TextInputField } from '@/components/shared/forms';
import { ActionButton } from '@/components/shared/layout';
import {
  Dialog,
  DialogBody,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogSurface,
  DialogTitle,
} from '@/components/ui';
import { useAuth, useNotice } from '@/hooks';

export function CreateClubDialog({
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

  useEffect(() => {
    if (!open) {
      setName('');
      setIsSubmitting(false);
    }
  }, [open]);

  const operatorId = session?.user.operatorId ?? session?.user.userId;
  const canCreate = !!session?.user.roles.isRegisteredPlayer && !!operatorId && name.trim().length > 0 && !isSubmitting;

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
      const created = await clubsApi.createClub({
        name: trimmedName,
        creatorId: operatorId,
      });
      notifySuccess('俱乐部已创建', `${created.name} 已创建，当前账号已被设为俱乐部管理员。`);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogSurface>
          <DialogHeader className="border-b border-[color:var(--line)] px-6 py-5">
            <DialogTitle>创建俱乐部</DialogTitle>
            <DialogDescription>创建成功后，你会自动成为该俱乐部的管理员。</DialogDescription>
          </DialogHeader>

          <DialogBody className="px-6 py-5">
            <FieldGroup className="guest-flow__form">
              <TextInputField
                label="俱乐部名称"
                value={name}
                placeholder="例如：东风俱乐部"
                onChange={(event) => setName(event.currentTarget.value)}
                disabled={isSubmitting}
              />
              <TextInputField label="创建者" value={session?.user.displayName ?? ''} readOnly />
            </FieldGroup>
          </DialogBody>

          <DialogFooter className="border-t border-[color:var(--line)] px-6 py-5">
            <div className="grid w-full gap-3 sm:grid-cols-2">
              <ActionButton onClick={() => void handleSubmit()} disabled={!canCreate}>
                {isSubmitting ? '创建中...' : '创建并进入详情'}
              </ActionButton>
              <ActionButton variant="secondary" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                取消
              </ActionButton>
            </div>
          </DialogFooter>
        </DialogSurface>
      </DialogPortal>
    </Dialog>
  );
}
