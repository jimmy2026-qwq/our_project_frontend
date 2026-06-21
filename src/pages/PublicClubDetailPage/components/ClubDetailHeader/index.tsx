import type { ClubDetailWorkbenchState } from '../../objects/ClubDetail.types';
import { clubDetailShellClassNames } from '../ClubDetailShell.styles';
import { ClubHeroActions } from './ClubHeroActions';

interface ClubDetailHeaderProps {
  workbench: ClubDetailWorkbenchState;
  onApply: () => void;
  onNavigateBack: () => void;
}

/** 俱乐部详情页顶部的名称、荣誉、统计和操作区。 */
export function ClubDetailHeader({
  workbench,
  onApply,
  onNavigateBack,
}: ClubDetailHeaderProps) {
  return (
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
          onApply={onApply}
        />
      </div>
    </header>
  );
}
