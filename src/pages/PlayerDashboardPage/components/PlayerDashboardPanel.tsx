import type { ReactNode } from 'react';

import { cx } from '@/components/ui/cx';

import { detailShellClassNames } from './PlayerDashboardShell.styles';

/** 玩家仪表盘各内容区使用的基础面板容器。 */
export function PlayerDashboardPanel({ children }: { children: ReactNode }) {
  return (
    <div
      className={cx(
        detailShellClassNames.panel,
        detailShellClassNames.panelFull,
      )}
    >
      {children}
    </div>
  );
}
