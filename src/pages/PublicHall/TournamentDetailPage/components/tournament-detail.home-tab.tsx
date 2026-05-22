import { TournamentOverviewPanel } from './tournament-detail.panels';
import { detailShellClassNames } from './tournament-detail.styles';
import type { TournamentDetailWorkbenchState } from '../objects/tournament-detail.types';

export function TournamentDetailHomeTab({
  workbench,
  onToggleShowMore,
}: {
  workbench: TournamentDetailWorkbenchState;
  onToggleShowMore: () => void;
}) {
  return (
    <>
      <div className={detailShellClassNames.panel}>
        <section className={detailShellClassNames.list}>
          <div className={detailShellClassNames.panelBody}>
            <TournamentOverviewPanel
              profile={workbench.profile}
              showMoreInfo={workbench.showMoreInfo}
              onToggleShowMore={onToggleShowMore}
            />
          </div>
        </section>
      </div>
    </>
  );
}
