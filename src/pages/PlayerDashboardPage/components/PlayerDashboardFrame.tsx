import type { ReactNode } from 'react';

import { detailShellClassNames } from './PlayerDashboardShell.styles';

/** 玩家仪表盘页面的整体背景和内容宽度容器。 */
export function PlayerDashboardFrame({ children }: { children: ReactNode }) {
  return (
    <div className={detailShellClassNames.page}>
      <span
        className={detailShellClassNames.pageBackground}
        aria-hidden="true"
      />
      <span className={detailShellClassNames.pageOverlay} aria-hidden="true" />
      {children}
    </div>
  );
}
