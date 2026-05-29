import { type ReactNode } from 'react';

import { Alert, EmptyState } from '@/components/ui';
import { cx } from '@/components/ui/cx';

import type {
  ClubPublicProfile,
  DetailState,
} from '../../objects/PublicClubDetailPage.types';
import type { ClubDetailWorkbenchState } from '../../objects/ClubDetail.types';
import { clubDetailShellClassNames } from '../ClubDetailShell.styles';
import { ClubContributionChangesPanel } from './components/ClubContributionChangesPanel';
import { ClubInboxPanel } from './components/ClubInboxPanel';
import { ClubMembersPanel } from './components/ClubMembersPanel';
import { ClubPublicInfoPanel } from './components/ClubPublicInfoPanel';
import { ClubRecentTournamentsPanel } from './components/ClubRecentTournamentsPanel';
import { useClubDetailContent } from './hooks/useClubDetailContent';
import type { useClubDetailWorkbench } from './hooks/useClubDetailWorkbench';

type ClubDetailControls = Omit<
  ReturnType<typeof useClubDetailWorkbench>,
  'workbench'
>;

interface ClubDetailContentProps {
  state: DetailState<ClubPublicProfile>;
  workbench: ClubDetailWorkbenchState;
  controls: ClubDetailControls;
}

export function ClubDetailContent({
  state,
  workbench,
  controls,
}: ClubDetailContentProps) {
  const { activeTab, setActiveTab, tabItems } = useClubDetailContent(workbench);

  return (
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
                void controls.handleAcceptTournamentInvitation(tournament)
              }
              onDeclineInvitation={(tournament) =>
                void controls.handleDeclineTournamentInvitation(tournament)
              }
              onOpenLineup={(tournament) => {
                controls.setSelectedLineupTournament(tournament);
                controls.setIsLineupDialogOpen(true);
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
                  void controls.handleReview(applicationId, decision)
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
                controls.setIsContributionTitleDialogOpen(true)
              }
              onAssignAdmin={(member) =>
                void controls.handleAssignAdmin(member)
              }
              onAdjustContribution={(member) => {
                controls.setSelectedContributionMember(member);
                controls.setIsContributionDialogOpen(true);
              }}
              onEditTitle={(member) => {
                controls.setSelectedTitleMember(member);
                controls.setIsTitleDialogOpen(true);
              }}
              onRemoveMember={(member) =>
                void controls.handleRemoveMember(member)
              }
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
  );
}

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
