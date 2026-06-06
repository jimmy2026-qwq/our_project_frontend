import { useEffect, useState } from 'react';

import { GetPlayerAPI } from '@/api/player';
import { TournamentRecordListAPI, TournamentStageTablesAPI } from '@/api/tournament';
import type { MatchRecordSummary } from '@/pages/objects/TournamentViews';
import { sendAPI } from '@/system/api';
import { mapEnvelope } from '@/system/api/http';

import { getTournamentFormatLabel } from '../../../../../functions/getTournamentDetailRules';
import type { TournamentDetailTableItem } from '../../../../../objects/TournamentDetail.types';
import type {
  DetailState,
  TournamentPublicProfile,
} from '../../../../../objects/PublicTournamentDetailPage.types';
import { toPlayerProfile } from '../../../../../objects/TournamentDetailPlayer.mappers';
import {
  toMatchRecordSummary,
  toTournamentTableSummary,
} from '../../../../../objects/TournamentDetailTable.mappers';

export function useTournamentTableData({
  localProfile,
  state,
}: {
  localProfile: TournamentPublicProfile | null;
  state: DetailState<TournamentPublicProfile>;
}) {
  const [tables, setTables] = useState<TournamentDetailTableItem[]>([]);
  const [recordByTableId, setRecordByTableId] = useState<
    Record<string, MatchRecordSummary>
  >({});
  const [playerNames, setPlayerNames] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;

    async function loadTables() {
      const currentProfile = localProfile ?? state.item;
      const stageEntries = currentProfile?.stages ?? [];

      if (!currentProfile?.id || stageEntries.length === 0) {
        if (!cancelled) {
          setTables([]);
        }
        return;
      }

      try {
        const payloads = await Promise.all(
          stageEntries.map(async (stage) => {
            const envelope = await sendAPI(
              new TournamentStageTablesAPI(currentProfile.id, stage.stageId, {
                limit: 100,
                offset: 0,
              }),
            ).then((tableEnvelope) =>
              mapEnvelope(tableEnvelope, toTournamentTableSummary),
            );

            const stageDisplayName = `${currentProfile.name} ${getTournamentFormatLabel(stage.format)}`;

            return envelope.items.map((table) => ({
              id: table.id,
              stageId: table.stageId,
              stageName: stageDisplayName,
              tableCode: table.tableCode,
              status: table.status,
              playerIds: table.playerIds,
            }));
          }),
        );

        if (!cancelled) {
          setTables(payloads.flat());
        }
      } catch {
        if (!cancelled) {
          setTables([]);
        }
      }
    }

    void loadTables();

    return () => {
      cancelled = true;
    };
  }, [localProfile, state.item]);

  useEffect(() => {
    let cancelled = false;

    async function loadRecords() {
      const currentProfile = localProfile ?? state.item;

      if (!currentProfile?.id) {
        if (!cancelled) {
          setRecordByTableId({});
        }
        return;
      }

      try {
        const envelope = await sendAPI(
          new TournamentRecordListAPI({
            tournamentId: currentProfile.id,
            limit: 200,
            offset: 0,
          }),
        ).then((recordEnvelope) =>
          mapEnvelope(recordEnvelope, toMatchRecordSummary),
        );
        const records = [...envelope.items].sort((left, right) =>
          right.recordedAt.localeCompare(left.recordedAt),
        );
        const nextRecordByTableId = records.reduce(
          (recordMap, record) => {
            if (record.tableId && !recordMap[record.tableId]) {
              recordMap[record.tableId] = record;
            }

            return recordMap;
          },
          {} as Record<string, MatchRecordSummary>,
        );

        if (!cancelled) {
          setRecordByTableId(nextRecordByTableId);
        }
      } catch {
        if (!cancelled) {
          setRecordByTableId({});
        }
      }
    }

    void loadRecords();

    return () => {
      cancelled = true;
    };
  }, [localProfile, state.item]);

  useEffect(() => {
    let cancelled = false;

    async function loadPlayerNames() {
      const missingIds = Array.from(
        new Set(
          tables
            .flatMap((table) => table.playerIds)
            .filter((playerId) => !(playerId in playerNames)),
        ),
      );

      if (missingIds.length === 0) {
        return;
      }

      const entries = await Promise.all(
        missingIds.map(async (playerId) => {
          try {
            const player = await sendAPI(new GetPlayerAPI(playerId)).then(
              toPlayerProfile,
            );
            return [playerId, player.displayName] as const;
          } catch {
            return [playerId, playerId] as const;
          }
        }),
      );

      if (!cancelled) {
        setPlayerNames((current) => ({
          ...current,
          ...Object.fromEntries(entries),
        }));
      }
    }

    void loadPlayerNames();

    return () => {
      cancelled = true;
    };
  }, [playerNames, tables]);

  return { playerNames, recordByTableId, tables };
}
