import type { ReactNode } from 'react';

import { detailShellClassNames } from './PlayerDashboardShell.styles';

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
