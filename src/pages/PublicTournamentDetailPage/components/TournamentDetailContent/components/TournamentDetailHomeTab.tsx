import { TournamentOverviewPanel } from './TournamentOverviewPanel';
import { detailShellClassNames } from '../../detailShell.styles';
import type { TournamentDetailWorkbenchState } from '../../../objects/TournamentDetail.types';

/** 赛事详情页默认首页标签，组合概览、阶段和邀请信息。 */
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
