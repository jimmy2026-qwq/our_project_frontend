import type { ReactNode } from 'react';

import { Button, StatusPill } from '@/components/ui';
import type { PlayerProfile } from '@/pages/objects/PlayerProfile';

import {
  getPlayerStatusLabel,
  getRankLabel,
  participantText,
} from '../functions/getTournamentDetailParticipantsText';

export function ToggleArrow({
  expanded,
  label,
  onClick,
}: {
  expanded: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="grid size-9 shrink-0 place-items-center rounded-full border border-[rgba(176,223,229,0.2)] bg-[rgba(255,255,255,0.04)] text-sm font-semibold text-[#f2f7fb] transition hover:border-[rgba(114,216,209,0.42)] hover:bg-[rgba(114,216,209,0.1)]"
      onClick={onClick}
    >
      {expanded ? '^' : 'v'}
    </button>
  );
}

export function ParticipantSection({
  title,
  count,
  countUnit,
  expanded,
  toggleLabel,
  canManageTournament,
  actionLabel,
  actionDisabled,
  onAction,
  onToggle,
  children,
}: {
  title: string;
  count: number;
  countUnit: string;
  expanded: boolean;
  toggleLabel: string;
  canManageTournament: boolean;
  actionLabel: string;
  actionDisabled: boolean;
  onAction: () => void;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <section className="grid self-start gap-3">
      <div className="flex min-h-[58px] flex-wrap items-center justify-between gap-3 rounded-[18px] border border-[rgba(176,223,229,0.14)] bg-[rgba(255,255,255,0.03)] px-4 py-2.5">
        <div className="flex min-w-0 flex-wrap items-center gap-3">
          <strong className="text-[1.05rem] text-[#f2f7fb]">{title}</strong>
          <StatusPill tone={count > 0 ? 'info' : 'neutral'}>
            {count} {countUnit}
          </StatusPill>
        </div>
        <div className="flex items-center gap-2">
          {canManageTournament ? (
            <Button
              size="sm"
              variant="outline"
              onClick={onAction}
              disabled={actionDisabled}
            >
              {actionLabel}
            </Button>
          ) : null}
          <ToggleArrow
            expanded={expanded}
            label={toggleLabel}
            onClick={onToggle}
          />
        </div>
      </div>
      {expanded ? (
        <div className="rounded-[18px] border border-[rgba(176,223,229,0.12)] bg-[rgba(255,255,255,0.025)] p-3">
          {children}
        </div>
      ) : null}
    </section>
  );
}

export function PlayerRow({ player }: { player: PlayerProfile }) {
  return (
    <article className="grid gap-2 rounded-[18px] border border-[rgba(176,223,229,0.14)] px-4 py-3 sm:grid-cols-[1fr_auto] sm:items-center">
      <div className="grid gap-1">
        <strong className="text-[#f2f7fb]">{player.displayName}</strong>
        <span className="text-sm text-[#9ab0c1]">
          {getRankLabel(player)} / {participantText.elo} {player.elo ?? 0}
        </span>
      </div>
      <StatusPill
        tone={player.playerStatus === 'Active' ? 'success' : 'warning'}
      >
        {getPlayerStatusLabel(player.playerStatus)}
      </StatusPill>
    </article>
  );
}

export function LineupRoster({
  activePlayers,
  reservePlayers,
  missingPlayerIds,
  isLoading,
}: {
  activePlayers: PlayerProfile[];
  reservePlayers: PlayerProfile[];
  missingPlayerIds: string[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <p className="m-0 text-sm text-[#9ab0c1]">
        {participantText.loadingMembers}
      </p>
    );
  }

  if (
    activePlayers.length === 0 &&
    reservePlayers.length === 0 &&
    missingPlayerIds.length === 0
  ) {
    return (
      <p className="m-0 text-sm text-[#9ab0c1]">{participantText.noMembers}</p>
    );
  }

  return (
    <div className="grid max-h-[260px] gap-3 overflow-y-auto pr-1">
      {activePlayers.length > 0 ? (
        <strong className="text-sm text-[#9ab0c1]">
          {participantText.activeLineup}
        </strong>
      ) : null}
      {activePlayers.map((member) => (
        <PlayerRow key={member.playerId} player={member} />
      ))}
      {reservePlayers.length > 0 ? (
        <strong className="pt-2 text-sm text-[#9ab0c1]">
          {participantText.reserveLineup}
        </strong>
      ) : null}
      {reservePlayers.map((member) => (
        <PlayerRow key={member.playerId} player={member} />
      ))}
      {missingPlayerIds.map((playerId) => (
        <article
          key={playerId}
          className="rounded-[18px] border border-[rgba(176,223,229,0.14)] px-4 py-3 text-sm text-[#9ab0c1]"
        >
          {playerId}
        </article>
      ))}
    </div>
  );
}
