import { ActionButton } from '@/components/shared/layout';
import { FieldGroup, SelectField } from '@/components/shared/forms';
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
      <DialogTitle>éŽ·å¤‰æ±‰é™å‚ç¦Œ</DialogTitle>
      <DialogDescription>
        å§ï½…æ¹ªæ¶“è¡¡â‚¬æ¸°{tournament?.name ?? 'è¤°æ’³å¢ ç’§æ¶—ç°¨'}éˆ¥æ¿‹â‚¬å¤‹å«¨é™å‚ç¦ŒéŽ´æ„¬æ†³éŠ†å‚šå‡¡é™å‚ç¦ŒéŽ´æ„¬æ†³æµ¼æ°­å¸“é¦ã„¥åžªç›ã„¦æ¸¶æ¶“å©‡æ½°éŠ†?
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
            label="é—ƒèˆµî†Œ"
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
              <option value="">é†å‚›æ£¤é—ƒèˆµî†Œ</option>
            )}
          </SelectField>
          <SelectField
            label="å¨²æ˜ç©¬ç»›æ¶¢â‚¬?"
            value={statusFilter}
            onChange={(event) => onStatusFilterChange(event.currentTarget.value as MemberStatusFilter)}
          >
            <option value="all">éã„©å„´éŽ´æ„¬æ†³</option>
            <option value="active">æµ å‘®æ¤¿ç’ºå†©åžšé›?</option>
            <option value="inactive">æµ å‘´æ½ªå¨²æ˜ç©¬éŽ´æ„¬æ†³</option>
          </SelectField>
          <SelectField
            label="ELO éŽºæŽ‘ç°­"
            value={eloSort}
            onChange={(event) => onEloSortChange(event.currentTarget.value as EloSort)}
          >
            <option value="desc">æµ åº¨ç®é’é¢ç¶†</option>
            <option value="asc">æµ åºç¶†é’ä¼´ç®</option>
          </SelectField>
        </FieldGroup>

        <div className="grid gap-3 rounded-[22px] border border-[color:var(--line)] bg-[rgba(255,255,255,0.03)] p-4">
          <div className="flex items-center justify-between gap-3">
            <strong>æ·‡å˜ç®°é–®ã„¦åžšé›?</strong>
            <StatusPill tone="info">å®¸æŸ¥â‚¬å¤‹å«¨ {selectedPlayerIds.length} æµœ?</StatusPill>
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
                    {member.isSelected ? <StatusPill tone="success">å®¸æ’å¼¬ç’§?</StatusPill> : null}
                  </div>
                  <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-[color:var(--text)]">
                    <input
                      type="checkbox"
                      checked={member.isSelected}
                      onChange={() => onTogglePlayer(member.playerId)}
                    />
                    é–«å¤‹å«¨ç’‡ãƒ¦åžšé›?
                  </label>
                </div>
              ))}
            </div>
          ) : (
            <p className="m-0 text-[color:var(--muted)]">
              {isLoading ? 'å§ï½…æ¹ªé”çŠºæµ‡éŽ´æ„¬æ†³é’æ¥„ã€ƒ...' : 'è¤°æ’³å¢ ç»›æ¶¢â‚¬å¤‹æ½¯æµ æœµç¬…å¨Œâ„ƒæ¹é™îˆžâ‚¬å¤‹åžšé›æ¨¸â‚¬?'}
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
          {isSubmitting ? 'éŽ»æ„ªæ°¦æ¶“?..' : 'éŽ»æ„ªæ°¦é™å‚ç¦Œéšå¶…å´Ÿ'}
        </ActionButton>
        <ActionButton variant="secondary" onClick={onClose} disabled={isSubmitting}>
          éæŠ½æ£´
        </ActionButton>
      </div>
    </DialogFooter>
  );
}
