import { useState, type ReactNode } from 'react';

import { Alert, EmptyState } from '@/components/ui';
import { cx } from '@/components/ui/cx';
import type { AuthSession } from '@/providers/auth/AuthSession';

import { PublicClubDetailNotFound } from '../PublicClubDetailFrame';
import { useClubDetailWorkbench } from './hooks/ClubDetailWorkbench.hooks';
import type { ClubPublicProfile, DetailState } from '../../objects/types';
import { ClubDetailDialogs } from './ClubDetailDialogs';
import {
  ClubContributionChangesPanel,
  ClubHeroActions,
  ClubInboxPanel,
  ClubMembersPanel,
  ClubPublicInfoPanel,
  ClubRecentTournamentsPanel,
} from './components';
import { clubDetailShellClassNames } from './styles';

type ClubDetailTab =
  | 'home'
  | 'tournaments'
  | 'applications'
  | 'members'
  | 'contributionChanges';

export const PublicClubDetailSection = ({
  state,
  session,
  onNavigateBack,
  onRefreshDetail,
}: {
  state: DetailState<ClubPublicProfile>;
  session: AuthSession | null;
  onNavigateBack: () => void;
  onRefreshDetail?: () => void;
}) => {
  const {
    workbench,
    setIsApplicationDialogOpen,
    setIsLineupDialogOpen,
    setSelectedLineupTournament,
    setIsContributionDialogOpen,
    setSelectedContributionMember,
    setIsTitleDialogOpen,
    setSelectedTitleMember,
    setIsContributionTitleDialogOpen,
    setIsCurrentMember,
    handleApplicationStatusChange,
    handleReview,
    handleAcceptTournamentInvitation,
    handleDeclineTournamentInvitation,
    handleAssignAdmin,
    handleRemoveMember,
    handleAdjustContribution,
    handleUpdateTitle,
    handleUpdateContributionTitles,
  } = useClubDetailWorkbench({
    state,
    session,
    onRefreshDetail,
  });
  const [activeTab, setActiveTab] = useState<ClubDetailTab>('home');

  if (!state.item || !workbench) {
    return <PublicClubDetailNotFound title="Club not found" />;
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
    ...(workbench.canReviewApplications
      ? [{ id: 'applications' as const, label: '申请处理' }]
      : []),
    { id: 'members', label: '成员列表' },
    ...(workbench.canViewContributionChanges
      ? [{ id: 'contributionChanges' as const, label: '贡献变化' }]
      : []),
  ];

  return (
    <>
      <section className={clubDetailShellClassNames.shell}>
        <header className={clubDetailShellClassNames.header}>
          <button
            type="button"
            className={clubDetailShellClassNames.back}
            onClick={onNavigateBack}
          >
            返回公共大厅
          </button>
          <div className={clubDetailShellClassNames.title}>
            俱乐部详情 / {workbench.profile.name}
          </div>
          <div className={clubDetailShellClassNames.headerActions}>
            <ClubHeroActions
              isClubMember={workbench.isClubMember}
              canApply={workbench.canApply}
              currentApplicationStatus={workbench.currentApplicationStatus}
              onApply={() => setIsApplicationDialogOpen(true)}
            />
          </div>
        </header>

        <div className={clubDetailShellClassNames.frame}>
          <aside className={clubDetailShellClassNames.sidebar}>
            {tabItems.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={cx(
                  clubDetailShellClassNames.navItem,
                  activeTab === tab.id
                    ? clubDetailShellClassNames.navItemActive
                    : '',
                )}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </aside>

          <div className={clubDetailShellClassNames.content}>
            {activeTab === 'home' ? (
              <PanelFrame>
                <ClubPublicInfoPanel
                  profile={workbench.profile}
                  featuredPlayerNames={workbench.featuredPlayerNames}
                />
              </PanelFrame>
            ) : null}

            {activeTab === 'tournaments' ? (
              <PanelFrame>
                <ClubRecentTournamentsPanel
                  tournaments={workbench.profile.activeTournaments}
                  canManageLineup={workbench.canManageLineup}
                  onAcceptInvitation={(tournament) =>
                    void handleAcceptTournamentInvitation(tournament)
                  }
                  onDeclineInvitation={(tournament) =>
                    void handleDeclineTournamentInvitation(tournament)
                  }
                  onOpenLineup={(tournament) => {
                    setSelectedLineupTournament(tournament);
                    setIsLineupDialogOpen(true);
                  }}
                />
              </PanelFrame>
            ) : null}

            {activeTab === 'applications' ? (
              <PanelFrame>
                {workbench.canReviewApplications ? (
                  <ClubInboxPanel
                    isInboxLoading={workbench.isInboxLoading}
                    applicationInbox={workbench.applicationInbox}
                    onReview={(applicationId, decision) =>
                      void handleReview(applicationId, decision)
                    }
                  />
                ) : (
                  <EmptyState asListItem={false}>
                    你当前没有处理这家俱乐部申请的权限。
                  </EmptyState>
                )}
              </PanelFrame>
            ) : null}

            {activeTab === 'members' ? (
              <PanelFrame>
                <ClubMembersPanel
                  isLoading={workbench.isClubMembersLoading}
                  members={workbench.clubMembers}
                  canAssignAdmins={workbench.canAssignAdmins}
                  canAdjustContributions={workbench.canAdjustContributions}
                  canEditTitles={workbench.canEditTitles}
                  canRemoveMembers={workbench.canRemoveMembers}
                  onOpenContributionTitles={() =>
                    setIsContributionTitleDialogOpen(true)
                  }
                  onAssignAdmin={(member) => void handleAssignAdmin(member)}
                  onAdjustContribution={(member) => {
                    setSelectedContributionMember(member);
                    setIsContributionDialogOpen(true);
                  }}
                  onEditTitle={(member) => {
                    setSelectedTitleMember(member);
                    setIsTitleDialogOpen(true);
                  }}
                  onRemoveMember={(member) => void handleRemoveMember(member)}
                />
              </PanelFrame>
            ) : null}

            {activeTab === 'contributionChanges' ? (
              <PanelFrame>
                <ClubContributionChangesPanel
                  isLoading={workbench.isContributionChangesLoading}
                  changes={workbench.contributionChanges}
                  members={workbench.clubMembers}
                />
              </PanelFrame>
            ) : null}

            {state.warning ? (
              <Alert variant="warning">{state.warning}</Alert>
            ) : null}
          </div>
        </div>
      </section>

      <ClubDetailDialogs
        workbench={workbench}
        clubSummary={clubSummary}
        onRefreshDetail={onRefreshDetail}
        setIsApplicationDialogOpen={setIsApplicationDialogOpen}
        setIsLineupDialogOpen={setIsLineupDialogOpen}
        setSelectedLineupTournament={setSelectedLineupTournament}
        setIsContributionDialogOpen={setIsContributionDialogOpen}
        setSelectedContributionMember={setSelectedContributionMember}
        setIsTitleDialogOpen={setIsTitleDialogOpen}
        setSelectedTitleMember={setSelectedTitleMember}
        setIsContributionTitleDialogOpen={setIsContributionTitleDialogOpen}
        setIsCurrentMember={setIsCurrentMember}
        handleApplicationStatusChange={handleApplicationStatusChange}
        handleAdjustContribution={handleAdjustContribution}
        handleUpdateTitle={handleUpdateTitle}
        handleUpdateContributionTitles={handleUpdateContributionTitles}
      />
    </>
  );
};

function PanelFrame({ children }: { children: ReactNode }) {
  return (
    <div
      className={cx(
        clubDetailShellClassNames.panel,
        clubDetailShellClassNames.panelFull,
      )}
    >
      {children}
    </div>
  );
}
