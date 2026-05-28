import { ClubDetailContent } from './components/ClubDetailContent';
import { ClubDetailDialogs } from './components/ClubDetailDialogs';
import { ClubDetailHeader } from './components/ClubDetailHeader';
import { clubDetailShellClassNames } from './components/ClubDetailShell.styles';
import {
  PublicClubDetailFrame,
  PublicClubDetailLoading,
  PublicClubDetailNotFound,
} from './components/PublicClubDetailFrame';
import { usePublicClubDetailPage } from './hooks/usePublicClubDetailPage';

export function PublicClubDetailPage() {
  const page = usePublicClubDetailPage();

  if (page.isLoading || !page.state) {
    return (
      <PublicClubDetailFrame>
        <PublicClubDetailLoading />
      </PublicClubDetailFrame>
    );
  }

  if (!page.state.item || !page.workbench || !page.clubSummary) {
    return (
      <PublicClubDetailFrame>
        <PublicClubDetailNotFound title="Club not found" />
      </PublicClubDetailFrame>
    );
  }

  return (
    <PublicClubDetailFrame>
      <section className={clubDetailShellClassNames.shell}>
        <ClubDetailHeader
          workbench={page.workbench}
          onNavigateBack={page.onNavigateBack}
          onApply={() => page.controls.setIsApplicationDialogOpen(true)}
        />
        <ClubDetailContent
          state={page.state}
          workbench={page.workbench}
          controls={page.controls}
        />
      </section>
      <ClubDetailDialogs
        workbench={page.workbench}
        clubSummary={page.clubSummary}
        controls={page.controls}
        onRefreshDetail={page.onRefreshDetail}
      />
    </PublicClubDetailFrame>
  );
}
