import { Button } from '@/components/ui';

import { detailShellClassNames } from '../detailShell.styles';
import type { TournamentDetailWorkbenchState } from '../../objects/TournamentDetail.types';

/** 公开赛事详情页顶部的标题、状态、摘要和主要操作区。 */
export function TournamentDetailHeader({
  workbench,
  onBack,
  onPublishTournament,
  onRunHeaderStageAction,
}: {
  workbench: TournamentDetailWorkbenchState;
  onBack: () => void;
  onPublishTournament: () => void;
  onRunHeaderStageAction: () => void;
}) {
  return (
    <header className={detailShellClassNames.header}>
      <button
        type="button"
        className={detailShellClassNames.back}
        onClick={onBack}
      >
        返回大厅
      </button>
      <div className={detailShellClassNames.title}>
        {`赛事：${workbench.profile.name}`}
      </div>
      <div className={detailShellClassNames.headerActions}>
        {workbench.headerStageAction ? (
          <Button
            onClick={onRunHeaderStageAction}
            disabled={workbench.isSubmittingTournamentAction}
          >
            {workbench.headerStageAction.label}
          </Button>
        ) : null}
        {workbench.isWaitingForLineups ? (
          <Button variant="outline" disabled>
            等待俱乐部确定人选
          </Button>
        ) : null}
        {workbench.canPublishTournament ? (
          <Button
            variant="secondary"
            onClick={onPublishTournament}
            disabled={workbench.isSubmittingTournamentAction}
          >
            发布赛事
          </Button>
        ) : null}
      </div>
    </header>
  );
}
