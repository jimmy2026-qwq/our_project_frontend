import { EmptyState } from '@/components/ui';
import { cx } from '@/components/ui/cx';

import { detailShellClassNames } from '../../../detailShell.styles';
import { InviteParticipantDialog } from './components/TournamentParticipantsDialogs';
import { ClubParticipantList } from './components/TournamentParticipantsPanel';
import { participantText } from './objects/TournamentDetailParticipantsText';
import {
  ParticipantSection,
  PlayerRow,
} from './components/TournamentParticipantsShared';
import { useTournamentDetailParticipantsTab } from './hooks/useTournamentDetailParticipantsTab';
import type { TournamentDetailWorkbenchState } from '../../../../objects/TournamentDetail.types';

export function TournamentDetailParticipantsTab({
  workbench,
  onInviteClub,
  onInvitePlayer,
  onSelectClubId,
  onSelectPlayerId,
}: {
  workbench: TournamentDetailWorkbenchState;
  onInviteClub: () => Promise<void> | void;
  onInvitePlayer: () => Promise<void> | void;
  onSelectClubId: (clubId: string) => void;
  onSelectPlayerId: (playerId: string) => void;
}) {
  const tab = useTournamentDetailParticipantsTab(workbench);

  return (
    <>
      <div
        className={cx(
          detailShellClassNames.panel,
          detailShellClassNames.panelFull,
        )}
      >
        <section className="grid h-full min-h-0 content-start gap-[14px] overflow-x-hidden overflow-y-auto pr-2 [scrollbar-gutter:stable]">
          <div className="grid auto-rows-min content-start items-start gap-4 p-4">
            <h2 className="m-0 text-[1.25rem] font-semibold text-[#f2f7fb]">
              {participantText.participants}
            </h2>
            <div className="grid content-start items-start gap-4">
              <ParticipantSection
                title={participantText.clubSection}
                count={workbench.invitedClubs.length}
                countUnit={participantText.clubs}
                expanded={tab.clubsExpanded}
                toggleLabel={
                  tab.clubsExpanded
                    ? participantText.collapseClubs
                    : participantText.expandClubs
                }
                canManageTournament={workbench.canManageTournament}
                actionLabel={participantText.inviteClub}
                actionDisabled={
                  workbench.isSubmittingTournamentAction ||
                  workbench.selectableClubs.length === 0
                }
                onAction={() => tab.setClubInviteOpen(true)}
                onToggle={() => tab.setClubsExpanded((current) => !current)}
              >
                <ClubParticipantList
                  workbench={workbench}
                  expandedClubIds={tab.expandedClubIds}
                  lineupSubmissionByClubId={tab.lineupSubmissionByClubId}
                  lineupPlayersById={tab.lineupPlayersById}
                  loadingLineupPlayerIds={tab.loadingLineupPlayerIds}
                  onToggleClubRoster={tab.toggleClubRoster}
                />
              </ParticipantSection>

              <ParticipantSection
                title={participantText.playerSection}
                count={workbench.participantPlayers.length}
                countUnit={participantText.people}
                expanded={tab.playersExpanded}
                toggleLabel={
                  tab.playersExpanded
                    ? participantText.collapsePlayers
                    : participantText.expandPlayers
                }
                canManageTournament={workbench.canManageTournament}
                actionLabel={participantText.invitePlayer}
                actionDisabled={
                  workbench.isSubmittingTournamentAction ||
                  workbench.selectablePlayers.length === 0
                }
                onAction={() => tab.setPlayerInviteOpen(true)}
                onToggle={() => tab.setPlayersExpanded((current) => !current)}
              >
                {workbench.participantPlayers.length > 0 ? (
                  <div className="grid max-h-[52vh] gap-3 overflow-y-auto pr-1">
                    {workbench.participantPlayers.map((player) => (
                      <PlayerRow key={player.playerId} player={player} />
                    ))}
                  </div>
                ) : (
                  <EmptyState asListItem={false}>
                    {participantText.noPlayers}
                  </EmptyState>
                )}
              </ParticipantSection>
            </div>
          </div>
        </section>
      </div>

      <InviteParticipantDialog
        open={tab.clubInviteOpen}
        title={participantText.inviteClubTitle}
        description={participantText.inviteClubDescription}
        label={participantText.chooseClub}
        value={workbench.selectedClubId}
        options={tab.clubOptions}
        isSubmitting={workbench.isSubmittingTournamentAction}
        emptyLabel={participantText.noClubOptions}
        onValueChange={onSelectClubId}
        onSubmit={async () => {
          await onInviteClub();
          tab.setClubInviteOpen(false);
        }}
        onOpenChange={tab.setClubInviteOpen}
      />

      <InviteParticipantDialog
        open={tab.playerInviteOpen}
        title={participantText.invitePlayerTitle}
        description={participantText.invitePlayerDescription}
        label={participantText.choosePlayer}
        value={workbench.selectedPlayerId}
        options={tab.playerOptions}
        isSubmitting={workbench.isSubmittingTournamentAction}
        emptyLabel={participantText.noPlayerOptions}
        onValueChange={onSelectPlayerId}
        onSubmit={async () => {
          await onInvitePlayer();
          tab.setPlayerInviteOpen(false);
        }}
        onOpenChange={tab.setPlayerInviteOpen}
      />
    </>
  );
}
