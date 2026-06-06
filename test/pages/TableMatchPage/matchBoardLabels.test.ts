import { describe, expect, it } from 'vitest';

import {
  getActionLabel,
  getActionTone,
  getMahjongPhaseLabel,
  getMahjongStatusLabel,
  getRoundLabel,
  getSeatLabel,
  getSeatStateBadges,
  getShortPlayerLabel,
} from '@/pages/TableMatchPage/components/MatchBoard/matchBoardLabels';

describe('match board labels', () => {
  it('maps seats, rounds, table statuses and phases to Chinese labels', () => {
    expect(getSeatLabel('East')).toBe('东');
    expect(getSeatLabel('South')).toBe('南');
    expect(getSeatLabel('West')).toBe('西');
    expect(getSeatLabel('North')).toBe('北');
    expect(getRoundLabel({ roundWind: 'East', handNumber: 3 })).toBe('东3局');

    expect(getMahjongStatusLabel('Aborted')).toBe('已中止');
    expect(getMahjongStatusLabel('Archived')).toBe('已归档');
    expect(getMahjongStatusLabel('Finished')).toBe('已结束');
    expect(getMahjongStatusLabel('InProgress')).toBe('进行中');
    expect(getMahjongStatusLabel('NotStarted')).toBe('未开始');
    expect(getMahjongStatusLabel('RoundEnded')).toBe('本局结束');
    expect(getMahjongStatusLabel('WaitingCallDecision')).toBe('等待牌局推进');
    expect(getMahjongStatusLabel('WaitingPlayerAction')).toBe('等待出牌');

    expect(getMahjongPhaseLabel('CallDecision')).toBe('牌局推进中');
    expect(getMahjongPhaseLabel('Finished')).toBe('本局完成');
    expect(getMahjongPhaseLabel('InitialDeal')).toBe('配牌');
    expect(getMahjongPhaseLabel('PlayerTurn')).toBe('手番');
    expect(getMahjongPhaseLabel('Settlement')).toBe('结算');
    expect(getMahjongPhaseLabel('WinDecision')).toBe('和牌判断');
  });

  it('formats legal actions and button tones', () => {
    expect(getActionLabel({ commandType: 'Discard', tile: '5m' } as never)).toBe(
      '切牌 5m',
    );
    expect(getActionLabel({ commandType: 'Ron' } as never)).toBe('荣和');

    expect(getActionTone('Ron')).toBe('danger');
    expect(getActionTone('Tsumo')).toBe('danger');
    expect(getActionTone('Chi')).toBe('secondary');
    expect(getActionTone('Pon')).toBe('secondary');
    expect(getActionTone('OpenKan')).toBe('secondary');
    expect(getActionTone('ClosedKan')).toBe('secondary');
    expect(getActionTone('AddedKan')).toBe('secondary');
    expect(getActionTone('Pass')).toBe('outline');
    expect(getActionTone('Discard')).toBe('default');
    expect(getActionTone('Riichi')).toBe('default');
  });

  it('shortens long player identifiers without touching compact ones', () => {
    expect(getShortPlayerLabel('player-a')).toBe('player-a');
    expect(getShortPlayerLabel('player-1234567890abcdef')).toBe('player...cdef');
  });

  it('builds seat state badges with private furiten visibility rules', () => {
    expect(
      getSeatStateBadges({
        riichi: true,
        ippatsu: true,
        furiten: false,
        tenpai: true,
      } as never),
    ).toEqual([{ label: '立直' }, { label: '一发' }, { label: '听牌' }]);

    expect(
      getSeatStateBadges(
        {
          riichi: false,
          ippatsu: false,
          furiten: true,
          tenpai: true,
        } as never,
        { showPrivateState: true },
      ),
    ).toEqual([{ label: '振听', tone: 'danger' }]);

    expect(
      getSeatStateBadges({
        riichi: false,
        ippatsu: false,
        furiten: true,
        tenpai: true,
      } as never),
    ).toEqual([]);
  });
});
