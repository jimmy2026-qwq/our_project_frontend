import { cx } from '@/components/ui/cx';

import type { TournamentDetailTab } from '@/pages/PublicTournamentDetailPage/objects/navigation/TournamentDetailTab';
import { detailShellClassNames } from '../detailShell.styles';

export type TournamentDetailContentTabItem = {
  id: TournamentDetailTab;
  label: string;
};

/** 赛事详情页右侧的上下文、权限和快捷操作侧栏。 */
export function TournamentDetailSidebar({
  activeTab,
  tabItems,
  onActiveTabChange,
}: {
  activeTab: TournamentDetailTab;
  tabItems: TournamentDetailContentTabItem[];
  onActiveTabChange: (tab: TournamentDetailTab) => void;
}) {
  return (
    <aside className={detailShellClassNames.sidebar}>
      {tabItems.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={cx(
            detailShellClassNames.navItem,
            activeTab === tab.id ? detailShellClassNames.navItemActive : '',
          )}
          onClick={() => onActiveTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </aside>
  );
}
