import { Link } from 'react-router-dom';

import { DetailHero, DetailPageShell } from '@/components/shared/data-display';
import type { ClubPublicProfile } from '@/domain/public';
import { useAuth } from '@/hooks/useAuth';

import { ClubApplicationDialog } from '../ClubApplicationDialog';
import { ClubTournamentLineupDialog } from '../ClubTournamentLineupDialog';
import type { DetailState } from '../types';
import { PublicDetailNotFound } from './shared';
import { useClubDetailWorkbench } from './club-detail.hooks';
import {
  ClubHeroActions,
  ClubInboxPanel,
  ClubPublicInfoPanel,
  ClubRecentTournamentsPanel,
} from './club-detail.panels';

export const PublicClubDetailSection = ({
  state,
  onRefreshDetail,
}: {
  state: DetailState<ClubPublicProfile>;
  onRefreshDetail?: () => void;
}) => {
  const { session } = useAuth();
  const {
    workbench,
    setIsApplicationDialogOpen,
    setIsLineupDialogOpen,
    setSelectedLineupTournament,
    setIsCurrentMember,
    handleReview,
  } = useClubDetailWorkbench({
    state,
    session,
    onRefreshDetail,
  });

  if (!state.item || !workbench) {
    return <PublicDetailNotFound title="Club not found" />;
  }

  const clubSummary = {
    id: workbench.profile.id,
    name: workbench.profile.name,
    memberCount: workbench.profile.memberCount,
    powerRating: workbench.profile.powerRating,
    treasury: workbench.profile.treasury,
    relations: workbench.profile.relations,
  };

  return (
    <>
      <DetailPageShell
        backLink={
          <Link className="detail-back" to="/public" reloadDocument>
            Back to public hall
          </Link>
        }
        hero={
          <DetailHero
            eyebrow="Club"
            title={workbench.profile.name}
            tagline={workbench.profile.slogan}
            summary={workbench.profile.description}
            actions={
              <ClubHeroActions
                isClubMember={workbench.isClubMember}
                canApply={workbench.canApply}
                onApply={() => setIsApplicationDialogOpen(true)}
              />
            }
            source={state.source}
            warning={state.warning}
          />
        }
      >
        <section className="detail-grid grid gap-[22px] md:grid-cols-2">
          <ClubPublicInfoPanel
            profile={workbench.profile}
            featuredPlayerNames={workbench.featuredPlayerNames}
          />
          <ClubRecentTournamentsPanel
            tournaments={workbench.profile.activeTournaments}
            canManageLineup={workbench.canManageLineup}
            onOpenLineup={(tournament) => {
              setSelectedLineupTournament(tournament);
              setIsLineupDialogOpen(true);
            }}
          />
        </section>
        {workbench.isCurrentClubAdmin ? (
          <section className="detail-grid grid gap-[22px]">
            <ClubInboxPanel
              isInboxLoading={workbench.isInboxLoading}
              applicationInbox={workbench.applicationInbox}
              onReview={(applicationId, decision) => void handleReview(applicationId, decision)}
            />
          </section>
        ) : null}
      </DetailPageShell>
      {workbench.canApply ? (
        <ClubApplicationDialog
          club={clubSummary}
          open={workbench.isApplicationDialogOpen}
          onOpenChange={setIsApplicationDialogOpen}
          onMembershipConfirmed={() => {
            setIsCurrentMember(true);
            onRefreshDetail?.();
          }}
        />
      ) : null}
      {workbench.canManageLineup ? (
        <ClubTournamentLineupDialog
          clubId={workbench.profile.id}
          operatorId={workbench.operatorId}
          tournament={workbench.selectedLineupTournament}
          open={workbench.isLineupDialogOpen}
          onOpenChange={(nextOpen) => {
            setIsLineupDialogOpen(nextOpen);
            if (!nextOpen) {
              setSelectedLineupTournament(null);
            }
          }}
        />
      ) : null}
    </>
  );
};
