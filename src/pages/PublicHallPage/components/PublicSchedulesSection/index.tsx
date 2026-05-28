import { useState } from 'react';

import {
  ActionButton,
  EmptyState,
  FilterActionRow,
  PortalSection,
  SelectField,
} from '@/components/ui';
import type { PublicSchedule } from '../../objects/PublicHallPage.types';
import type { LoadState, PublicHallState } from '../../objects/PublicHallPage.types';
import {
  STAGE_STATUS_FILTER_OPTIONS,
  TOURNAMENT_STATUS_FILTER_OPTIONS,
} from '../../functions/getPublicHallLabels';

import {
  hallSectionClassNames,
  publicHallSectionSlots,
} from '../PublicHallSection.styles';
import { CreateTournamentDialog } from './CreateTournamentDialog';
import { ScheduleRow } from './ScheduleRow';

export function PublicSchedulesSection({
  payload,
  state,
  canCreateTournament,
  onStateChange,
  onRefresh,
}: {
  payload: LoadState<PublicSchedule>;
  state: PublicHallState;
  canCreateTournament: boolean;
  onStateChange: (patch: Partial<PublicHallState>) => void;
  onRefresh: () => void;
}) {
  const [isCreateTournamentOpen, setIsCreateTournamentOpen] = useState(false);

  return (
    <>
      <PortalSection
        className={hallSectionClassNames.section}
        slotClassNames={publicHallSectionSlots}
        eyebrow="赛程"
        title={
          <div className={hallSectionClassNames.titleRow}>
            <span>公开赛程</span>
            {canCreateTournament ? (
              <ActionButton
                className={hallSectionClassNames.createButton}
                variant="secondary"
                size="sm"
                onClick={() => setIsCreateTournamentOpen(true)}
              >
                创建比赛
              </ActionButton>
            ) : null}
          </div>
        }
        description="查看当前公共大厅中的公开赛事、赛事状态和阶段进度。"
        source={payload.source}
        warning={payload.warning}
      >
        <FilterActionRow
          className={hallSectionClassNames.filters}
          onRefresh={onRefresh}
        >
          <SelectField
            label="赛事状态"
            value={state.scheduleTournamentStatus}
            onChange={(event) =>
              onStateChange({
                scheduleTournamentStatus: event.currentTarget
                  .value as PublicHallState['scheduleTournamentStatus'],
              })
            }
          >
            {TOURNAMENT_STATUS_FILTER_OPTIONS.map((option) => (
              <option key={option.value || 'all'} value={option.value}>
                {option.label}
              </option>
            ))}
          </SelectField>
          <SelectField
            label="赛事阶段"
            value={state.scheduleStageStatus}
            onChange={(event) =>
              onStateChange({
                scheduleStageStatus: event.currentTarget
                  .value as PublicHallState['scheduleStageStatus'],
              })
            }
          >
            {STAGE_STATUS_FILTER_OPTIONS.map((option) => (
              <option key={option.value || 'all'} value={option.value}>
                {option.label}
              </option>
            ))}
          </SelectField>
        </FilterActionRow>
        <section className={hallSectionClassNames.list}>
          <div className={hallSectionClassNames.listBody}>
            {payload.envelope.items.length > 0 ? (
              payload.envelope.items.map((item) => (
                <ScheduleRow
                  key={`${item.tournamentId}-${item.stageId}`}
                  item={item}
                />
              ))
            ) : (
              <EmptyState>当前没有可展示的公开赛程。</EmptyState>
            )}
          </div>
        </section>
      </PortalSection>
      {canCreateTournament ? (
        <CreateTournamentDialog
          open={isCreateTournamentOpen}
          onOpenChange={setIsCreateTournamentOpen}
        />
      ) : null}
    </>
  );
}
