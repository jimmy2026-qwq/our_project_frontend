import { Button } from '@/components/ui';
import type { TableDetail } from '@/pages/objects/TournamentViews';

import { getAppealButtonText } from '../../objects/TableMatch.labels';
import type { TableSeat } from '../../objects/TableMatch.types';

interface TableMatchAppealActionProps {
  status: TableDetail['status'];
  ownSeat: TableSeat | null;
  operatorId: string;
  canFileAppeal: boolean;
  isRegisteredPlayer: boolean;
  onOpenAppeal: () => void;
}

export function TableMatchAppealAction({
  status,
  ownSeat,
  operatorId,
  canFileAppeal,
  isRegisteredPlayer,
  onOpenAppeal,
}: TableMatchAppealActionProps) {
  return (
    <div className="flex justify-end">
      <div className="grid max-w-[360px] justify-items-end gap-2 text-right">
        <Button
          variant={canFileAppeal ? 'secondary' : 'outline'}
          onClick={onOpenAppeal}
          disabled={!canFileAppeal}
        >
          {getAppealButtonText(status)}
        </Button>
        <p className="m-0 text-sm text-[#9ab0c1]">
          {getAppealUnavailableText({
            status,
            ownSeat,
            operatorId,
            isRegisteredPlayer,
          })}
        </p>
      </div>
    </div>
  );
}

function getAppealUnavailableText({
  status,
  ownSeat,
  operatorId,
  isRegisteredPlayer,
}: {
  status: TableDetail['status'];
  ownSeat: TableSeat | null;
  operatorId: string;
  isRegisteredPlayer: boolean;
}) {
  if (!isRegisteredPlayer || !operatorId) {
    return '请先登录玩家账号后再提交赛事申诉。';
  }

  if (!ownSeat) {
    return '只有本桌参赛玩家可以发起赛事申诉。';
  }

  if (status === 'Archived') {
    return '牌桌已归档，不能再创建新的申诉工单。';
  }

  if (status === 'AppealInProgress') {
    return '当前牌桌已有进行中的申诉工单。';
  }

  return '如对本桌赛事过程有异议，可在这里提交申诉说明。';
}
