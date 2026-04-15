import { useState } from 'react';
import { Link } from 'react-router-dom';

import { EmptyState } from '@/components/shared/feedback';
import { Alert } from '@/components/ui';
import type { ClubPublicProfile } from '@/domain/public';
import { useAuth } from '@/hooks/useAuth';

import { ClubApplicationDialog } from '../ClubApplicationDialog';
import { ClubTournamentLineupDialog } from '../ClubTournamentLineupDialog';
import type { DetailState } from '../types';
import { useClubDetailWorkbench } from './club-detail.hooks';
import {
  ClubAdminMembersPanel,
  ClubHeroActions,
  ClubInboxPanel,
  ClubPublicInfoPanel,
  ClubRecentTournamentsPanel,
} from './club-detail.panels';
import { PublicDetailNotFound } from './shared';

type ClubDetailTab = 'home' | 'tournaments' | 'applications' | 'members';

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
    handleAssignAdmin,
    handleRemoveMember,
  } = useClubDetailWorkbench({
    state,
    session,
    onRefreshDetail,
  });
  const [activeTab, setActiveTab] = useState<ClubDetailTab>('home');

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

  const tabItems: Array<{ id: ClubDetailTab; label: string }> = [
    { id: 'home', label: '俱乐部主页' },
    { id: 'tournaments', label: '相关赛事' },
    ...(workbench.isCurrentClubAdmin
      ? [
          { id: 'applications' as const, label: '入会申请' },
          { id: 'members' as const, label: '成员管理' },
        ]
      : []),
  ];

  return (
    <>
      <section className="tournament-detail-shell">
        <header className="tournament-detail-shell__header">
          <Link className="tournament-detail-shell__back" to="/public">
            返回大厅
          </Link>
          <div className="tournament-detail-shell__title-card">俱乐部：{workbench.profile.name}</div>
          <div className="tournament-detail-shell__header-actions">
            <ClubHeroActions
              isClubMember={workbench.isClubMember}
              canApply={workbench.canApply}
              onApply={() => setIsApplicationDialogOpen(true)}
            />
          </div>
        </header>

        <div className="tournament-detail-shell__frame">
          <aside className="tournament-detail-shell__sidebar">
            {tabItems.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`tournament-detail-shell__nav-item ${
                  activeTab === tab.id ? 'tournament-detail-shell__nav-item--active' : ''
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </aside>

          <div className="tournament-detail-shell__content">
            {activeTab === 'home' ? (
              <div className="tournament-detail-shell__panel tournament-detail-shell__panel--full">
                <ClubPublicInfoPanel
                  profile={workbench.profile}
                  featuredPlayerNames={workbench.featuredPlayerNames}
                />
              </div>
            ) : null}

            {activeTab === 'tournaments' ? (
              <div className="tournament-detail-shell__panel tournament-detail-shell__panel--full">
                <ClubRecentTournamentsPanel
                  tournaments={workbench.profile.activeTournaments}
                  canManageLineup={workbench.canManageLineup}
                  onOpenLineup={(tournament) => {
                    setSelectedLineupTournament(tournament);
                    setIsLineupDialogOpen(true);
                  }}
                />
              </div>
            ) : null}

            {activeTab === 'applications' ? (
              <div className="tournament-detail-shell__panel tournament-detail-shell__panel--full">
                {workbench.isCurrentClubAdmin ? (
                  <ClubInboxPanel
                    isInboxLoading={workbench.isInboxLoading}
                    applicationInbox={workbench.applicationInbox}
                    onReview={(applicationId, decision) => void handleReview(applicationId, decision)}
                  />
                ) : (
                  <EmptyState asListItem={false}>只有俱乐部管理员可以查看申请列表。</EmptyState>
                )}
              </div>
            ) : null}

            {activeTab === 'members' ? (
              <div className="tournament-detail-shell__panel tournament-detail-shell__panel--full">
                {workbench.isCurrentClubAdmin ? (
                  <ClubAdminMembersPanel
                    isLoading={workbench.isClubMembersLoading}
                    members={workbench.clubMembers}
                    onAssignAdmin={(member) => void handleAssignAdmin(member)}
                    onRemoveMember={(member) => void handleRemoveMember(member)}
                  />
                ) : (
                  <EmptyState asListItem={false}>只有俱乐部管理员可以管理成员。</EmptyState>
                )}
              </div>
            ) : null}

            {state.warning ? <Alert variant="warning">{state.warning}</Alert> : null}
          </div>
        </div>
      </section>

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
