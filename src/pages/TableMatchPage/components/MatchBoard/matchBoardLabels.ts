import type { ButtonProps } from '@/components/ui';
import type {
  KyokuDescriptor,
  MahjongCommandType,
  MahjongLegalAction,
  MahjongRoundPhase,
  MahjongSeatView,
  MahjongTableStatus,
  SeatWind,
} from '@/objects';

export function getSeatLabel(seat: SeatWind) {
  const labels: Record<SeatWind, string> = {
    East: '东',
    South: '南',
    West: '西',
    North: '北',
  };

  return labels[seat];
}

export function getRoundLabel(descriptor: KyokuDescriptor) {
  return `${getSeatLabel(descriptor.roundWind)}${descriptor.handNumber}局`;
}

export function getMahjongStatusLabel(status: MahjongTableStatus) {
  const labels: Record<MahjongTableStatus, string> = {
    Aborted: '已中止',
    Archived: '已归档',
    Finished: '已结束',
    InProgress: '进行中',
    NotStarted: '未开始',
    RoundEnded: '本局结束',
    WaitingCallDecision: '等待牌局推进',
    WaitingPlayerAction: '等待出牌',
  };

  return labels[status];
}

export function getMahjongPhaseLabel(phase: MahjongRoundPhase) {
  const labels: Record<MahjongRoundPhase, string> = {
    CallDecision: '牌局推进中',
    Finished: '本局完成',
    InitialDeal: '配牌',
    PlayerTurn: '手番',
    Settlement: '结算',
    WinDecision: '和牌判断',
  };

  return labels[phase];
}

export function getActionLabel(action: MahjongLegalAction) {
  const baseLabels: Record<MahjongCommandType, string> = {
    AbortiveDraw: '流局',
    AddedKan: '加杠',
    Chi: '吃',
    ClosedKan: '暗杠',
    Discard: '切牌',
    OpenKan: '明杠',
    Pass: '过',
    Pon: '碰',
    Riichi: '立直',
    Ron: '荣和',
    Tsumo: '自摸',
  };
  const tileSuffix = action.tile ? ` ${action.tile}` : '';

  return `${baseLabels[action.commandType]}${tileSuffix}`;
}

export function getActionTone(
  commandType: MahjongCommandType,
): ButtonProps['variant'] {
  if (commandType === 'Ron' || commandType === 'Tsumo') {
    return 'danger';
  }

  if (
    commandType === 'Chi' ||
    commandType === 'Pon' ||
    commandType === 'OpenKan' ||
    commandType === 'ClosedKan' ||
    commandType === 'AddedKan'
  ) {
    return 'secondary';
  }

  if (commandType === 'Pass') {
    return 'outline';
  }

  return 'default';
}

export function getShortPlayerLabel(playerId: string) {
  if (playerId.length <= 12) {
    return playerId;
  }

  return `${playerId.slice(0, 6)}...${playerId.slice(-4)}`;
}

export function getSeatStateBadges(seat: MahjongSeatView) {
  return [
    seat.riichi ? '立直' : '',
    seat.ippatsu ? '一发' : '',
    seat.furiten ? '振听' : '',
    seat.tenpai === true ? '听牌' : '',
  ].filter(Boolean);
}
