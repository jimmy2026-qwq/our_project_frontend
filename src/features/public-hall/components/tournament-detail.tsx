import { Link, useNavigate } from 'react-router-dom';

import { DetailHero, DetailPageShell } from '@/components/shared/data-display';
import { Button } from '@/components/ui';
import type { TournamentPublicProfile } from '@/domain/public';
import { useAuth } from '@/hooks/useAuth';

import type { DetailState } from '../types';
import { PublicDetailNotFound } from './shared';
import {
  PublishBlockedDialog,
  TournamentInvitedClubsPanel,
  TournamentOverviewPanel,
  TournamentStagesPanel,
  TournamentTablesPanel,
} from './tournament-detail.panels';
import { useTournamentDetailWorkbench } from './tournament-detail.hooks';

export const PublicTournamentDetailSection = ({
  state,
  stages,
  onScheduleSuccess,
}: {
  state: DetailState<TournamentPublicProfile>;
  stages: NonNullable<TournamentPublicProfile['stages']>;
  onScheduleSuccess?: () => void;
}) => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const {
    workbench,
    setSelectedClubId,
    setPublishBlockedOpen,
    setShowMoreInfo,
    handleInviteClub,
    handlePublishTournament,
    handleScheduleStage,
  } = useTournamentDetailWorkbench({
    state,
    session,
    navigate,
    onScheduleSuccess,
  });

  if (!state.item || !workbench) {
    return <PublicDetailNotFound title="Tournament not found" />;
  }

  return (
    <>
      <DetailPageShell
        backLink={
          <Link className="detail-back" to="/public">
            Back to public hall
          </Link>
        }
        hero={
          <DetailHero
            eyebrow="Tournament"
            title={workbench.profile.name}
            tagline={workbench.profile.tagline}
            summary={workbench.profile.description}
            actions={
              <div className="flex flex-wrap gap-3">
                {workbench.canScheduleStage ? (
                  <Button onClick={() => void handleScheduleStage()} disabled={workbench.isSubmittingTournamentAction}>
                    Schedule next stage
                  </Button>
                ) : null}
                {workbench.canPublishTournament ? (
                  <Button
                    variant="secondary"
                    onClick={() => void handlePublishTournament()}
                    disabled={workbench.isSubmittingTournamentAction}
                  >
                    Publish tournament
                  </Button>
                ) : null}
              </div>
            }
            source={state.source}
            warning={state.warning}
          />
        }
      >
        <section className="detail-grid grid gap-[22px] md:grid-cols-2">
          <div className="grid gap-[22px]">
            <TournamentOverviewPanel
              profile={workbench.profile}
              showMoreInfo={workbench.showMoreInfo}
              onToggleShowMore={() => setShowMoreInfo((current) => !current)}
            />
            <TournamentTablesPanel
              visibleTables={workbench.visibleTables}
              playerNames={workbench.playerNames}
              canManageTournament={workbench.canManageTournament}
            />
          </div>

          <div className="grid gap-[22px]">
            <TournamentInvitedClubsPanel
              invitedClubs={workbench.invitedClubs}
              selectableClubs={workbench.selectableClubs}
              selectedClubId={workbench.selectedClubId}
              canManageTournament={workbench.canManageTournament}
              isSubmittingTournamentAction={workbench.isSubmittingTournamentAction}
              onSelectedClubIdChange={setSelectedClubId}
              onInviteClub={() => void handleInviteClub()}
            />
            <TournamentStagesPanel stages={stages} />
          </div>
        </section>
      </DetailPageShell>

      <PublishBlockedDialog open={workbench.publishBlockedOpen} onOpenChange={setPublishBlockedOpen} />
    </>
  );
};
