import { cx } from '@/components/ui/cx';

import { playerDashboardTabs } from './PlayerDashboardContent/functions/getPlayerDashboardLabels';
import type { PlayerDetailTab } from './PlayerDashboardContent/objects/PlayerDashboardContent.types';
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
