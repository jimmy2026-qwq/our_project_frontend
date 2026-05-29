import { TournamentOverviewPanel } from './TournamentOverviewPanel';
import { detailShellClassNames } from '../../detailShell.styles';
import type { TournamentDetailWorkbenchState } from '../../../objects/TournamentDetail.types';

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
