import { useState } from 'react';

import {
  EmptyState,
  FilterActionRow,
  PortalSection,
  SelectField,
} from '@/components/ui';
import type { ClubSummary } from '@/pages/objects/ClubSummary';
import type { PlayerLeaderboardEntry } from '../../objects/PublicHallPage.types';
import type {
  LoadState,
  PublicHallState,
} from '../../objects/PublicHallPage.types';

import {
  hallSectionClassNames,
  publicHallSectionSlots,
} from '../PublicHallSection.styles';
import { LeaderboardRow } from './LeaderboardRow';
import { ManagePlayerDialog } from './ManagePlayerDialog';

export function PublicLeaderboardSection({
  payload,
  state,
  clubs,
  canManagePlayers,
  onStateChange,
  onRefresh,
  onPlayerManaged,
}: {
  payload: LoadState<PlayerLeaderboardEntry>;
  state: PublicHallState;
  clubs: ClubSummary[];
  canManagePlayers: boolean;
  onStateChange: (patch: Partial<PublicHallState>) => void;
  onRefresh: () => void;
  onPlayerManaged?: () => void;
}) {
  const [managedPlayer, setManagedPlayer] =
    useState<PlayerLeaderboardEntry | null>(null);

  return (
    <>
      <PortalSection
        className={hallSectionClassNames.section}
        slotClassNames={publicHallSectionSlots}
        eyebrow="排行"
        title={
          <div className={hallSectionClassNames.titleRow}>
            <span>选手排名</span>
          </div>
        }
        description="查看当前公共大厅中的选手 Elo 排名、所属俱乐部和当前状态。"
        source={payload.source}
        warning={payload.warning}
      >
        <FilterActionRow
          className={hallSectionClassNames.filters}
          onRefresh={onRefresh}
        >
          <SelectField
            label="俱乐部"
            value={state.leaderboardClubId}
            onChange={(event) =>
              onStateChange({ leaderboardClubId: event.currentTarget.value })
            }
          >
            <option value="">全部俱乐部</option>
            {clubs.map((club) => (
              <option key={club.id} value={club.id}>
                {club.name}
              </option>
            ))}
          </SelectField>
          <SelectField
            label="状态"
            value={state.leaderboardStatus}
            onChange={(event) =>
              onStateChange({
                leaderboardStatus: event.currentTarget
                  .value as PublicHallState['leaderboardStatus'],
              })
            }
          >
            <option value="">全部状态</option>
            <option value="Active">活跃</option>
            <option value="Inactive">停用</option>
            <option value="Banned">封禁</option>
          </SelectField>
        </FilterActionRow>
        <section className={hallSectionClassNames.list}>
          <div className={hallSectionClassNames.listBody}>
            {payload.envelope.items.length > 0 ? (
              payload.envelope.items.map((item, index) => (
                <LeaderboardRow
                  key={item.playerId}
                  canManagePlayers={canManagePlayers}
                  clubs={clubs}
                  index={index}
                  item={item}
                  onManagePlayer={setManagedPlayer}
                />
              ))
            ) : (
              <EmptyState>当前没有可展示的选手排名。</EmptyState>
            )}
          </div>
        </section>
      </PortalSection>
      {canManagePlayers ? (
        <ManagePlayerDialog
          open={!!managedPlayer}
          player={managedPlayer}
          onOpenChange={(nextOpen) => {
            if (!nextOpen) {
              setManagedPlayer(null);
            }
          }}
          onCompleted={onPlayerManaged}
        />
      ) : null}
    </>
  );
}
