import type { ReactNode } from 'react';

import { cx } from '@/components/ui/cx';

import { detailShellClassNames } from './PlayerDashboardShell.styles';

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
