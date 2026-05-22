import { useState } from 'react';

import { EmptyState } from '@/components/ui';
import { Alert } from '@/components/ui';
import { cx } from '@/components/ui/cx';
import type { ClubPublicProfile } from '@/pages/PublicHall/objects';
import type { AuthSession } from '@/providers/auth/AuthSession';

import { ClubApplicationDialog } from './ClubApplicationDialog';
import { ClubContributionDialog } from './ClubContributionDialog';
import { ClubTitleDialog } from './ClubTitleDialog';
import { ClubTournamentLineupDialog } from './ClubTournamentLineupDialog';
import type { DetailState } from '@/pages/PublicHall/objects/types';
import { useClubDetailWorkbench } from '../hooks/club-detail.hooks';
import {
  ClubContributionChangesPanel,
  ClubMembersPanel,
  ClubHeroActions,
  ClubInboxPanel,
  ClubPublicInfoPanel,
  ClubRecentTournamentsPanel,
} from './club-detail.panels';
import { PublicDetailNotFound } from '@/pages/PublicHall/components/shared';

type ClubDetailTab =
  | 'home'
  | 'tournaments'
  | 'applications'
  | 'members'
  | 'contributionChanges';

const clubDetailShellClassNames = {
  shell: 'relative grid gap-[18px] text-[#f2f7fb]',
  header:
    'relative grid min-h-[52px] grid-cols-[132px_minmax(0,1fr)] items-center gap-[14px] max-[980px]:min-h-0 max-[980px]:grid-cols-1',
  back:
    'fixed left-7 top-6 z-[5] inline-flex min-h-12 items-center justify-center border-2 !border-[rgba(219,175,98,0.4)] bg-[rgba(28,40,74,0.88)] bg-[linear-gradient(180deg,rgba(29,42,78,0.9),rgba(28,40,74,0.88))] px-[18px] text-[rgba(239,189,111,0.96)] no-underline shadow-none max-[980px]:static',
  title:
    'col-start-2 inline-flex min-h-[52px] min-w-[min(100%,640px)] items-center justify-center justify-self-center border-2 !border-[rgba(219,175,98,0.4)] bg-[rgba(28,40,74,0.58)] bg-[linear-gradient(180deg,rgba(29,42,78,0.74),rgba(28,40,74,0.64))] px-9 text-center text-[1.42rem] font-bold text-[rgba(239,189,111,0.98)] shadow-none max-[980px]:col-auto',
  headerActions:
    'absolute right-0 top-1/2 flex -translate-y-1/2 flex-wrap justify-end gap-2.5 max-[980px]:static max-[980px]:translate-y-0',
  frame:
    'grid grid-cols-[132px_minmax(0,1fr)] items-start max-[980px]:grid-cols-1 max-[980px]:gap-[18px]',
  sidebar:
    'relative z-[2] -ml-[72px] grid content-start gap-[14px] overflow-y-auto pt-[22px] max-[980px]:ml-0 max-[980px]:pt-0',
  navItem:
    'relative z-[1] min-h-[72px] cursor-pointer border-2 !border-[rgba(219,175,98,0.4)] bg-[rgba(28,40,74,0.88)] bg-[linear-gradient(180deg,rgba(29,42,78,0.9),rgba(28,40,74,0.88))] px-[18px] py-[14px] text-center !text-[1.18rem] !font-bold tracking-[0.04em] text-[rgba(225,230,243,0.92)] max-[980px]:border-r-2',
  navItemActive: '!border-[rgba(239,189,111,0.5)] text-[rgba(239,189,111,0.96)]',
  content:
    'relative z-[1] box-border grid h-[calc(100vh-190px)] max-h-[calc(100vh-190px)] min-h-[calc(100vh-190px)] grid-rows-[minmax(0,1fr)] overflow-hidden rounded-3xl border-2 !border-[rgba(219,175,98,0.4)] bg-[rgba(9,18,31,0.48)] bg-[linear-gradient(180deg,rgba(13,24,40,0.72),rgba(11,20,34,0.64))] px-[22px] py-[18px] shadow-[0_18px_42px_rgba(5,10,18,0.14),inset_0_1px_0_rgba(255,255,255,0.05)] max-[980px]:h-auto max-[980px]:max-h-none max-[980px]:min-h-0 max-[980px]:overflow-visible',
  panel:
    'box-border grid h-full max-h-full min-h-0 grid-rows-[minmax(0,1fr)] overflow-hidden border-2 !border-[rgba(219,175,98,0.32)] bg-[rgba(15,24,46,0.52)] p-[18px] [scrollbar-gutter:stable]',
  panelFull: 'min-h-full',
};

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
    setIsCurrentMember,
    handleApplicationStatusChange,
    handleReview,
    handleAcceptTournamentInvitation,
    handleDeclineTournamentInvitation,
    handleAssignAdmin,
    handleRemoveMember,
    handleAdjustContribution,
    handleUpdateTitle,
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
    ...(workbench.canReviewApplications
      ? [
          { id: 'applications' as const, label: '申请处理' },
        ]
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
              <div className={cx(clubDetailShellClassNames.panel, clubDetailShellClassNames.panelFull)}>
                <ClubPublicInfoPanel
                  profile={workbench.profile}
                  featuredPlayerNames={workbench.featuredPlayerNames}
                />
              </div>
            ) : null}

            {activeTab === 'tournaments' ? (
              <div className={cx(clubDetailShellClassNames.panel, clubDetailShellClassNames.panelFull)}>
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
              </div>
            ) : null}

            {activeTab === 'applications' ? (
              <div className={cx(clubDetailShellClassNames.panel, clubDetailShellClassNames.panelFull)}>
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
              </div>
            ) : null}

            {activeTab === 'members' ? (
              <div className={cx(clubDetailShellClassNames.panel, clubDetailShellClassNames.panelFull)}>
                <ClubMembersPanel
                  isLoading={workbench.isClubMembersLoading}
                  members={workbench.clubMembers}
                  canAssignAdmins={workbench.canAssignAdmins}
                  canAdjustContributions={workbench.canAdjustContributions}
                  canEditTitles={workbench.canEditTitles}
                  canRemoveMembers={workbench.canRemoveMembers}
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
              </div>
            ) : null}

            {activeTab === 'contributionChanges' ? (
              <div className={cx(clubDetailShellClassNames.panel, clubDetailShellClassNames.panelFull)}>
                <ClubContributionChangesPanel
                  isLoading={workbench.isContributionChangesLoading}
                  changes={workbench.contributionChanges}
                  members={workbench.clubMembers}
                />
              </div>
            ) : null}

            {state.warning ? (
              <Alert variant="warning">{state.warning}</Alert>
            ) : null}
          </div>
        </div>
      </section>

      {workbench.canApply ? (
        <ClubApplicationDialog
          club={clubSummary}
          open={workbench.isApplicationDialogOpen}
          onOpenChange={setIsApplicationDialogOpen}
          onApplicationUpdated={handleApplicationStatusChange}
          onMembershipConfirmed={() => {
            setIsCurrentMember(true);
            handleApplicationStatusChange(null);
            onRefreshDetail?.();
          }}
        />
      ) : null}

      {workbench.canManageLineup || !!workbench.selectedLineupTournament ? (
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

      {workbench.canAdjustContributions ? (
        <ClubContributionDialog
          open={workbench.isContributionDialogOpen}
          member={workbench.selectedContributionMember}
          isSubmitting={workbench.isContributionSubmitting}
          onOpenChange={(nextOpen) => {
            setIsContributionDialogOpen(nextOpen);
            if (!nextOpen) {
              setSelectedContributionMember(null);
            }
          }}
          onSubmit={handleAdjustContribution}
        />
      ) : null}

      {workbench.canEditTitles ? (
        <ClubTitleDialog
          open={workbench.isTitleDialogOpen}
          member={workbench.selectedTitleMember}
          isSubmitting={workbench.isTitleSubmitting}
          onOpenChange={(nextOpen) => {
            setIsTitleDialogOpen(nextOpen);
            if (!nextOpen) {
              setSelectedTitleMember(null);
            }
          }}
          onSubmit={handleUpdateTitle}
        />
      ) : null}
    </>
  );
};
