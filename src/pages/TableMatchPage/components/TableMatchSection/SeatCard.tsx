import { StatusPill } from '@/components/ui';

import {
  getSeatStatusLabel,
  getSeatStatusTone,
} from '../../objects/TableMatch.labels';

interface SeatCardProps {
  wind: string;
  playerId: string;
  playerName: string;
  ready: boolean;
  disconnected: boolean;
  className?: string;
}

export function SeatCard({
  wind,
  playerId,
  playerName,
  ready,
  disconnected,
  className = '',
}: SeatCardProps) {
  return (
    <div
      className={[
        'rounded-[22px] border border-[rgba(176,223,229,0.14)] bg-[rgba(6,17,26,0.78)] p-4 shadow-[0_8px_24px_rgba(0,0,0,0.18)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <strong className="text-base">{wind}</strong>
        <StatusPill tone={getSeatStatusTone({ ready, disconnected })}>
          {getSeatStatusLabel({ ready, disconnected })}
        </StatusPill>
      </div>
      <div className="grid gap-2 text-sm text-[#c7d6e2]">
        <span className="font-medium text-[#f2f7fb]" title={playerId}>
          {playerName}
        </span>
        <span>准备状态：{ready ? '已准备' : '未准备'}</span>
        <span>连接状态：{disconnected ? '已断开' : '正常'}</span>
      </div>
    </div>
  );
}
