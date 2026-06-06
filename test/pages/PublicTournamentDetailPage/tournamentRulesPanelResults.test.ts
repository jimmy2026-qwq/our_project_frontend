import { describe, expect, it } from 'vitest';

import {
  getKnockoutResultRows,
  getQualifiedPlayerIds,
  getStandingResultRows,
  isCompletedStage,
  isFinalStage,
} from '@/pages/PublicTournamentDetailPage/components/TournamentDetailContent/components/TournamentDetailRulesPanel/functions/getTournamentRulesPanelResults';
import {
  isRecord,
  normalizePlayerIds,
} from '@/pages/PublicTournamentDetailPage/components/TournamentDetailContent/components/TournamentDetailRulesPanel/functions/normalizeTournamentRulesPanelValues';
import type { TournamentDetailWorkbenchState } from '@/pages/PublicTournamentDetailPage/objects/TournamentDetail.types';
import type { TournamentStageWithRules } from '@/pages/PublicTournamentDetailPage/objects/TournamentDetailRule.types';

describe('tournament rules panel result helpers', () => {
  it('normalizes loosely typed result payloads before rendering player lists', () => {
    expect(isRecord({ entries: [] })).toBe(true);
    expect(isRecord(null)).toBe(false);
    expect(isRecord('not-an-object')).toBe(false);
    expect(normalizePlayerIds(['p1', 2, 'p2', null])).toEqual(['p1', 'p2']);
    expect(normalizePlayerIds('p1')).toEqual([]);
  });

  it('builds knockout result rows from the decisive completed round', () => {
    const bracket = {
      rounds: [
        {
          roundNumber: 1,
          matches: [
            {
              advancementCount: 2,
              completed: true,
              results: [
                { advanced: true, placement: 2, playerId: 'p2' },
                { advanced: false, placement: 3, playerId: 'p3' },
                { advanced: true, placement: 1, playerId: 'p1' },
              ],
            },
          ],
        },
        {
          roundNumber: 2,
          matches: [
            {
              advancementCount: 0,
              completed: true,
              results: [
                { advanced: true, placement: 1, playerId: 'p1' },
                { advanced: false, placement: 2, playerId: 'p4' },
                { advanced: true, placement: 3, playerId: 'p2' },
                { advanced: true, placement: 4, playerId: 42 },
              ],
            },
          ],
        },
      ],
    };

    expect(getKnockoutResultRows(bracket, false)).toEqual([
      { placement: 1, playerId: 'p1' },
      { placement: 3, playerId: 'p2' },
    ]);
    expect(getKnockoutResultRows(bracket, true)).toEqual([
      { placement: 1, playerId: 'p1' },
      { placement: 2, playerId: 'p4' },
      { placement: 3, playerId: 'p2' },
    ]);
  });

  it('falls back to completed knockout matches when no final match exists', () => {
    const bracket = {
      rounds: [
        {
          roundNumber: 1,
          matches: [
            {
              advancementCount: 1,
              completed: true,
              results: [
                { advanced: true, playerId: 'p1' },
                { advanced: false, playerId: 'p2' },
              ],
            },
            { completed: false, results: [{ advanced: true, playerId: 'p3' }] },
          ],
        },
      ],
    };

    expect(getKnockoutResultRows(undefined, true)).toEqual([]);
    expect(getKnockoutResultRows({ rounds: 'bad' }, true)).toEqual([]);
    expect(getKnockoutResultRows(bracket, true)).toEqual([{ playerId: 'p1' }]);
  });

  it('chooses qualified players from knockout rows, explicit standings, standing entries, or bracket metadata', () => {
    expect(getQualifiedPlayerIds(null)).toEqual([]);
    expect(
      getQualifiedPlayerIds(
        stage({
          bracket: {
            rounds: [
              {
                matches: [
                  {
                    advancementCount: 0,
                    completed: true,
                    roundNumber: 1,
                    results: [
                      { advanced: true, placement: 1, playerId: 'winner' },
                      { advanced: false, placement: 2, playerId: 'runner-up' },
                    ],
                  },
                ],
              },
            ],
          },
          format: 'Knockout',
          standings: { qualifiedPlayerIds: ['standing-player'] },
        }),
      ),
    ).toEqual(['winner']);

    expect(
      getQualifiedPlayerIds(
        stage({
          standings: { qualifiedPlayerIds: ['p1', false, 'p2'] },
        }),
      ),
    ).toEqual(['p1', 'p2']);

    expect(
      getQualifiedPlayerIds(
        stage({
          standings: {
            entries: [
              { playerId: 'late-seed', qualified: true, seed: 8 },
              { playerId: 'early-seed', qualified: true, seed: 2 },
              { playerId: 'not-qualified', qualified: false, seed: 1 },
              { playerId: 10, qualified: true, seed: 3 },
            ],
          },
        }),
      ),
    ).toEqual(['early-seed', 'late-seed']);

    expect(
      getQualifiedPlayerIds(
        stage({
          bracket: { qualifiedPlayerIds: ['bracket-player', null] },
          standings: undefined,
        }),
      ),
    ).toEqual(['bracket-player']);
  });

  it('sorts standing rows and detects final completed stages', () => {
    const completedFinalStage = stage({
      order: 2,
      status: 'Completed',
      standings: {
        entries: [
          { playerId: 'p3' },
          { playerId: 'p1', seed: 1 },
          { playerId: 'p2', seed: 2 },
          { playerId: 9, seed: 3 },
        ],
      },
    });
    const laterStage = stage({ order: 3, stageId: 'later', status: 'Ready' });

    expect(getStandingResultRows(null)).toEqual([]);
    expect(getStandingResultRows(stage({ standings: { entries: 'bad' } }))).toEqual([]);
    expect(getStandingResultRows(completedFinalStage)).toEqual([
      { placement: 1, playerId: 'p1' },
      { placement: 2, playerId: 'p2' },
      { playerId: 'p3' },
    ]);

    expect(isCompletedStage(completedFinalStage)).toBe(true);
    expect(isCompletedStage(stage({ status: 'Archived' }))).toBe(true);
    expect(isCompletedStage(laterStage)).toBe(false);
    expect(isFinalStage(null, workbench([completedFinalStage]))).toBe(false);
    expect(isFinalStage(laterStage, workbench([completedFinalStage, laterStage]))).toBe(false);
    expect(isFinalStage(completedFinalStage, workbench([completedFinalStage]))).toBe(true);
    expect(isFinalStage(completedFinalStage, workbench([completedFinalStage, laterStage]))).toBe(
      false,
    );
  });
});

function stage(overrides: Partial<TournamentStageWithRules> = {}): TournamentStageWithRules {
  return {
    format: 'Swiss',
    name: 'Stage',
    pendingTablePlanCount: 0,
    roundCount: 4,
    stageId: 'stage-1',
    status: 'Ready',
    tableCount: 0,
    ...overrides,
  } as TournamentStageWithRules;
}

function workbench(stages: TournamentStageWithRules[]): TournamentDetailWorkbenchState {
  return {
    canManageTournament: false,
    canPublishTournament: false,
    canScheduleStage: false,
    headerStageAction: null,
    invitedClubs: [],
    isSubmittingTournamentAction: false,
    isWaitingForLineups: false,
    lineupSubmissionCounts: {},
    missingLineupClubNames: [],
    operatorId: undefined,
    participantPlayers: [],
    playerNames: {},
    profile: {
      description: '',
      id: 'tournament-1',
      name: 'Tournament',
      nextScheduledAt: '',
      nextStageId: stages[0]?.stageId ?? '',
      nextStageName: stages[0]?.name ?? '',
      nextStageStatus: stages[0]?.status ?? 'Ready',
      stageCount: stages.length,
      stages,
      status: 'InProgress',
      tagline: '',
      venue: '',
      whitelistType: 'Mixed',
    },
    publishBlockedOpen: false,
    recordByTableId: {},
    ruleDraft: {
      advanceCount: 8,
      format: 'Swiss',
      mahjongRuleset: {
        akaDora: true,
        akaDoraCount: 3,
        allowMultipleYakuman: true,
        bankruptcyEnd: true,
        doubleRon: true,
        gameLength: 'Hanchan',
        initialPoints: 25000,
        minHan: 1,
        nagashiMangan: true,
        openTanyao: true,
        targetPoints: 30000,
        tripleRonAbortiveDraw: true,
      },
    },
    rulesDialogOpen: false,
    selectableClubs: [],
    selectablePlayers: [],
    selectedClubId: '',
    selectedPlayerId: '',
    showMoreInfo: false,
    submittedLineupClubIds: [],
    tournamentActionError: '',
    visibleTables: [],
  };
}
