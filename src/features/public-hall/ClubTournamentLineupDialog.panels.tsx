import { FieldGroup, SelectField } from '@/components/shared/forms';
import { ActionButton } from '@/components/shared/layout';
import {
  DialogBody,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  StatusPill,
} from '@/components/ui';

import type {
  ClubTournamentItem,
  EloSort,
  MemberListItem,
  MemberStatusFilter,
} from './ClubTournamentLineupDialog.types';

export function ClubTournamentLineupHeader({
  tournament,
}: {
  tournament: ClubTournamentItem | null;
}) {
  return (
    <DialogHeader className="border-b border-[color:var(--line)] px-6 py-5">
      <DialogTitle>Submit club lineup</DialogTitle>
      <DialogDescription>
        Review the invited tournament, pick a stage, and submit the players who should represent the club.
        Current tournament: {tournament?.name ?? 'Unavailable'}.
      </DialogDescription>
    </DialogHeader>
  );
}

export function ClubTournamentLineupBody({
  isLoading,
  selectedStageId,
  stageOptions,
  statusFilter,
  eloSort,
  selectedPlayerIds,
  visibleMembers,
  onSelectedStageIdChange,
  onStatusFilterChange,
  onEloSortChange,
  onTogglePlayer,
}: {
  isLoading: boolean;
  selectedStageId: string;
  stageOptions: Array<{ id: string; name: string }>;
  statusFilter: MemberStatusFilter;
  eloSort: EloSort;
  selectedPlayerIds: string[];
  visibleMembers: MemberListItem[];
  onSelectedStageIdChange: (value: string) => void;
  onStatusFilterChange: (value: MemberStatusFilter) => void;
  onEloSortChange: (value: EloSort) => void;
  onTogglePlayer: (playerId: string) => void;
}) {
  return (
    <DialogBody className="px-6 py-5">
      <div className="grid gap-5">
        <FieldGroup className="grid gap-4 md:grid-cols-2">
          <SelectField
            label="Stage"
            value={selectedStageId}
            onChange={(event) => onSelectedStageIdChange(event.currentTarget.value)}
            disabled={isLoading || stageOptions.length === 0}
          >
            {stageOptions.length > 0 ? (
              stageOptions.map((stage) => (
                <option key={stage.id} value={stage.id}>
                  {stage.name}
                </option>
              ))
            ) : (
              <option value="">No stage is available for lineup submission</option>
            )}
          </SelectField>
          <SelectField
            label="Member status"
            value={statusFilter}
            onChange={(event) => onStatusFilterChange(event.currentTarget.value as MemberStatusFilter)}
          >
            <option value="all">All members</option>
            <option value="active">Active only</option>
            <option value="inactive">Inactive only</option>
          </SelectField>
          <SelectField
            label="ELO sort"
            value={eloSort}
            onChange={(event) => onEloSortChange(event.currentTarget.value as EloSort)}
          >
            <option value="desc">Highest first</option>
            <option value="asc">Lowest first</option>
          </SelectField>
        </FieldGroup>

        <div className="grid gap-3 rounded-[22px] border border-[color:var(--line)] bg-[rgba(255,255,255,0.03)] p-4">
          <div className="flex items-center justify-between gap-3">
            <strong>Eligible members</strong>
            <StatusPill tone="info">Selected: {selectedPlayerIds.length}</StatusPill>
          </div>
          {visibleMembers.length > 0 ? (
            <div className="grid max-h-[340px] gap-3 overflow-y-auto pr-1">
              {visibleMembers.map((member) => (
                <div
                  key={member.playerId}
                  className="grid gap-3 rounded-[18px] border border-[color:var(--line)] px-4 py-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="grid gap-1">
                      <strong>{member.displayName}</strong>
                      <span className="text-sm text-[color:var(--muted)]">
                        ELO {member.elo ?? 0} / {member.playerStatus ?? 'Active'}
                      </span>
                    </span>
                    {member.isSelected ? <StatusPill tone="success">Selected</StatusPill> : null}
                  </div>
                  <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-[color:var(--text)]">
                    <input
                      type="checkbox"
                      checked={member.isSelected}
                      onChange={() => onTogglePlayer(member.playerId)}
                    />
                    Include this player in the lineup
                  </label>
                </div>
              ))}
            </div>
          ) : (
            <p className="m-0 text-[color:var(--muted)]">
              {isLoading
                ? 'Loading club members and tournament stages...'
                : 'No eligible members matched the current filters.'}
            </p>
          )}
        </div>
      </div>
    </DialogBody>
  );
}

export function ClubTournamentLineupFooter({
  isSubmitting,
  selectedPlayerIds,
  onSubmit,
  onClose,
}: {
  isSubmitting: boolean;
  selectedPlayerIds: string[];
  onSubmit: () => void;
  onClose: () => void;
}) {
  return (
    <DialogFooter className="border-t border-[color:var(--line)] px-6 py-5">
      <div className="grid w-full gap-3 sm:grid-cols-2">
        <ActionButton onClick={onSubmit} disabled={isSubmitting || selectedPlayerIds.length === 0}>
          {isSubmitting ? 'Submitting lineup...' : 'Submit lineup'}
        </ActionButton>
        <ActionButton variant="secondary" onClick={onClose} disabled={isSubmitting}>
          Close
        </ActionButton>
      </div>
    </DialogFooter>
  );
}
