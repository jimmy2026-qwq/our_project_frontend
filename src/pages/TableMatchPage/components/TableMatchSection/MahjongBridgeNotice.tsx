import type { MahjongTableView } from '@/objects';

interface MahjongBridgeNoticeProps {
  error: string | null;
  isLoading: boolean;
  mahjongTable: MahjongTableView | null;
}

export function MahjongBridgeNotice({
  error,
  isLoading,
  mahjongTable,
}: MahjongBridgeNoticeProps) {
  if (mahjongTable?.currentRound) {
    return null;
  }

  const message = error
    ? `牌局引擎状态读取失败：${error}`
    : isLoading
      ? '正在读取牌局引擎状态...'
      : mahjongTable
        ? '牌局引擎已连接，等待开局。'
        : '牌局引擎尚未返回状态，当前显示赛事桌候场信息。';

  return (
    <div className="rounded-[22px] border border-[rgba(176,223,229,0.16)] bg-[rgba(7,18,28,0.72)] px-5 py-4 text-sm font-semibold text-[#c7d6e2] shadow-[0_16px_44px_rgba(0,0,0,0.22)]">
      {message}
    </div>
  );
}
