import { ActionButton } from '@/components/ui';
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui';

import type {
  ClubTournamentItem,
} from './types';
export { ClubTournamentLineupBody } from './ClubTournamentLineupBody';

export function ClubTournamentLineupHeader({
  tournament,
}: {
  tournament: ClubTournamentItem | null;
}) {
  return (
    <DialogHeader className="border-b border-[rgba(176,223,229,0.14)] px-6 py-5">
      <DialogTitle>提交俱乐部参赛名单</DialogTitle>
      <DialogDescription>
        请确认受邀赛事、选择赛段，并提交代表俱乐部出战的参赛成员。 当前赛事：
        {tournament?.name ?? '暂无'}。
      </DialogDescription>
    </DialogHeader>
  );
}

export function ClubTournamentLineupFooter({
  isSubmitting,
  selectedPlayerIds,
  onSubmit,
  onClose,
}: {
  isSubmitting: boolean;
  selectedPlayerIds: string[];
  onSubmit: () => void;
  onClose: () => void;
}) {
  return (
    <DialogFooter className="border-t border-[rgba(176,223,229,0.14)] px-6 py-5">
      <div className="grid w-full gap-3 sm:grid-cols-2">
        <ActionButton
          onClick={onSubmit}
          disabled={isSubmitting || selectedPlayerIds.length === 0}
        >
          {isSubmitting ? '正在提交名单...' : '提交名单'}
        </ActionButton>
        <ActionButton
          variant="secondary"
          onClick={onClose}
          disabled={isSubmitting}
        >
          关闭
        </ActionButton>
      </div>
    </DialogFooter>
  );
}
