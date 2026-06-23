import { cx } from '@/components/ui/cx';

import type { PlayerDetailTab } from '@/pages/PlayerDashboardPage/components/PlayerDashboardContent/objects/PlayerDetailTab';
import { playerDashboardTabs } from './PlayerDashboardContent/functions/getPlayerDashboardLabels';
import { detailShellClassNames } from './PlayerDashboardShell.styles';

/** 玩家仪表盘内不同信息标签页之间的导航。 */
export function PlayerDashboardNavigation({
  activeTab,
  onActiveTabChange,
}: {
  activeTab: PlayerDetailTab;
  onActiveTabChange: (tab: PlayerDetailTab) => void;
}) {
  return (
    <aside className={detailShellClassNames.sidebar}>
      {playerDashboardTabs.map((tab) => (
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
