import { Link } from 'react-router-dom';

import { Button } from '@/components/ui';

import { detailShellClassNames } from './PlayerDashboardShell.styles';

export function PlayerDashboardHeader({
  playerName,
  onLogout,
}: {
  playerName: string;
  onLogout: () => void;
}) {
  return (
    <header className={detailShellClassNames.header}>
      <Link className={detailShellClassNames.back} to="/public">
        返回大厅
      </Link>
      <div className={detailShellClassNames.title}>{`玩家：${playerName}`}</div>
      <div className={detailShellClassNames.headerActions}>
        <Button variant="secondary" onClick={onLogout}>
          退出登录
        </Button>
      </div>
    </header>
  );
}

