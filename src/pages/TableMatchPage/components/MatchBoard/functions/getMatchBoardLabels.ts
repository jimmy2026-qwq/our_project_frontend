import type { ButtonProps } from '@/components/ui';
import {
  MahjongCommandTypes,
  MahjongRoundPhases,
  MahjongTableStatuses,
  SeatWinds,
  type KyokuDescriptor,
  type MahjongCommandType,
  type MahjongLegalAction,
  type MahjongRoundPhase,
  type MahjongSeatView,
  type MahjongTableStatus,
  type SeatWind,
} from '@/objects';

export function getSeatLabel(seat: SeatWind) {
  const labels: Record<SeatWind, string> = {
    [SeatWinds.East]: '东',
    [SeatWinds.South]: '南',
    [SeatWinds.West]: '西',
    [SeatWinds.North]: '北',
  };

  return labels[seat];
}

export function getRoundLabel(descriptor: KyokuDescriptor) {
  return `${getSeatLabel(descriptor.roundWind)}${descriptor.handNumber}局`;
}

export function getMahjongStatusLabel(status: MahjongTableStatus) {
  const labels: Record<MahjongTableStatus, string> = {
    [MahjongTableStatuses.Aborted]: '已中止',
    [MahjongTableStatuses.Archived]: '已归档',
    [MahjongTableStatuses.Finished]: '已结束',
    [MahjongTableStatuses.InProgress]: '进行中',
    [MahjongTableStatuses.NotStarted]: '未开始',
    [MahjongTableStatuses.RoundEnded]: '本局结束',
    [MahjongTableStatuses.WaitingCallDecision]: '等待牌局推进',
    [MahjongTableStatuses.WaitingPlayerAction]: '等待出牌',
  };

  return labels[status];
}

export function getMahjongPhaseLabel(phase: MahjongRoundPhase) {
  const labels: Record<MahjongRoundPhase, string> = {
    [MahjongRoundPhases.CallDecision]: '牌局推进中',
    [MahjongRoundPhases.Finished]: '本局完成',
    [MahjongRoundPhases.InitialDeal]: '配牌',
    [MahjongRoundPhases.PlayerTurn]: '手番',
    [MahjongRoundPhases.Settlement]: '结算',
    [MahjongRoundPhases.WinDecision]: '和牌判断',
  };

  return labels[phase];
}

export function getActionLabel(action: MahjongLegalAction) {
  const baseLabels: Record<MahjongCommandType, string> = {
    [MahjongCommandTypes.AbortiveDraw]: '流局',
    [MahjongCommandTypes.AddedKan]: '加杠',
    [MahjongCommandTypes.Chi]: '吃',
    [MahjongCommandTypes.ClosedKan]: '暗杠',
    [MahjongCommandTypes.Discard]: '切牌',
    [MahjongCommandTypes.OpenKan]: '明杠',
    [MahjongCommandTypes.Pass]: '过',
    [MahjongCommandTypes.Pon]: '碰',
    [MahjongCommandTypes.Riichi]: '立直',
    [MahjongCommandTypes.Ron]: '荣和',
    [MahjongCommandTypes.Tsumo]: '自摸',
  };
  const tileSuffix = action.tile ? ` ${action.tile}` : '';

  return `${baseLabels[action.commandType]}${tileSuffix}`;
}

export function getActionTone(
  commandType: MahjongCommandType,
): ButtonProps['variant'] {
  if (
    commandType === MahjongCommandTypes.Ron ||
    commandType === MahjongCommandTypes.Tsumo
  ) {
    return 'danger';
  }

  if (
    commandType === MahjongCommandTypes.Chi ||
    commandType === MahjongCommandTypes.Pon ||
    commandType === MahjongCommandTypes.OpenKan ||
    commandType === MahjongCommandTypes.ClosedKan ||
    commandType === MahjongCommandTypes.AddedKan
  ) {
    return 'secondary';
  }

  if (commandType === MahjongCommandTypes.Pass) {
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

export type SeatStateBadge = {
  label: string;
  tone?: 'danger';
};

export function getSeatStateBadges(
  seat: MahjongSeatView,
  { showPrivateState = false }: { showPrivateState?: boolean } = {},
): SeatStateBadge[] {
  return [
    seat.riichi ? { label: '立直' } : undefined,
    seat.ippatsu ? { label: '一发' } : undefined,
    seat.furiten && showPrivateState
      ? { label: '振听', tone: 'danger' }
      : seat.tenpai === true && !seat.furiten
        ? { label: '听牌' }
        : undefined,
  ].filter((badge): badge is SeatStateBadge => Boolean(badge));
}
