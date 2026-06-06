import { useMemo, useState } from 'react';

import {
  ActionButton,
  CheckboxField,
  EmptyState,
  FilterActionRow,
  PortalSection,
} from '@/components/ui';
import type { ClubSummary } from '@/pages/objects/ClubSummary';
import type {
  LoadState,
  PublicHallState,
} from '../../objects/PublicHallPage.types';

import {
  hallSectionClassNames,
  publicHallSectionSlots,
} from '../PublicHallSection.styles';
import { ClubRow } from './ClubRow';
import { CreateClubDialog } from './CreateClubDialog';

export function PublicClubsSection({
  payload,
  state,
  canCreateClub,
  onStateChange,
  onRefresh,
}: {
  payload: LoadState<ClubSummary>;
  state: PublicHallState;
  canCreateClub: boolean;
  onStateChange: (patch: Partial<PublicHallState>) => void;
  onRefresh: () => void;
}) {
  const [isCreateClubOpen, setIsCreateClubOpen] = useState(false);
  const clubNamesById = useMemo(
    () =>
      Object.fromEntries(
        payload.envelope.items.map((club) => [club.id, club.name]),
      ),
    [payload.envelope.items],
  );

  return (
    <>
      <PortalSection
        className={hallSectionClassNames.section}
        slotClassNames={publicHallSectionSlots}
        eyebrow="俱乐部"
        title={
          <div className={hallSectionClassNames.titleRow}>
            <span>俱乐部名录</span>
            {canCreateClub ? (
              <ActionButton
                className={hallSectionClassNames.createButton}
                variant="secondary"
                size="sm"
                onClick={() => setIsCreateClubOpen(true)}
              >
                创建俱乐部
              </ActionButton>
            ) : null}
          </div>
        }
        description="查看当前公共大厅可浏览的俱乐部信息、成员规模和基础战力概览。"
        source={payload.source}
        warning={payload.warning}
      >
        <FilterActionRow
          className={hallSectionClassNames.filters}
          onRefresh={onRefresh}
        >
          <CheckboxField
            label="只显示可加入俱乐部"
            checked={state.clubActiveOnly}
            onChange={(event) =>
              onStateChange({ clubActiveOnly: event.currentTarget.checked })
            }
          />
        </FilterActionRow>
        <section className={hallSectionClassNames.list}>
          <div className={hallSectionClassNames.listBody}>
            {payload.envelope.items.length > 0 ? (
              payload.envelope.items.map((club) => (
                <ClubRow
                  key={club.id}
                  club={club}
                  clubNamesById={clubNamesById}
                />
              ))
            ) : (
              <EmptyState>当前没有可展示的俱乐部名录。</EmptyState>
            )}
          </div>
        </section>
      </PortalSection>
      {canCreateClub ? (
        <CreateClubDialog
          open={isCreateClubOpen}
          onOpenChange={setIsCreateClubOpen}
        />
      ) : null}
    </>
  );
}
