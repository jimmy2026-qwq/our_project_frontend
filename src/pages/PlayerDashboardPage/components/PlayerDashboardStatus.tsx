import { Link } from 'react-router-dom';

import { EmptyState, LoadingProgress } from '@/components/ui';
import { cx } from '@/components/ui/cx';

import { PlayerDashboardFrame } from './PlayerDashboardFrame';
import {
  detailShellClassNames,
  loadingClassNames,
} from './PlayerDashboardShell.styles';

export function PlayerDashboardLoading() {
  return (
    <PlayerDashboardFrame>
      <section className={loadingClassNames.portal}>
        <section className={loadingClassNames.hero}>
          <div className={loadingClassNames.main}>
            <span className={loadingClassNames.mainBorder} aria-hidden="true" />
            <p className={loadingClassNames.eyebrow}>玩家主页</p>
            <h1 className={loadingClassNames.title}>正在加载玩家主页...</h1>
            <p className={loadingClassNames.summary}>
              正在同步你的个人资料、近期牌桌、历史牌谱和赛事申诉工单。
            </p>
            <LoadingProgress
              className="relative z-[1] mt-6 max-w-[420px]"
              label="玩家主页加载中"
              message="请稍候，我们正在整理你的个人数据。"
              indeterminate
              tone="warm"
            />
          </div>
        </section>
      </section>
    </PlayerDashboardFrame>
  );
}

export function PlayerDashboardEmpty() {
  return (
    <PlayerDashboardFrame>
      <section className={detailShellClassNames.shell}>
        <header className={detailShellClassNames.header}>
          <Link className={detailShellClassNames.back} to="/public">
            返回大厅
          </Link>
          <div className={detailShellClassNames.title}>玩家主页</div>
        </header>
        <div className={detailShellClassNames.frame}>
          <div className={detailShellClassNames.content}>
            <div
              className={cx(
                detailShellClassNames.panel,
                detailShellClassNames.panelFull,
              )}
            >
              <EmptyState asListItem={false}>
                当前无法加载玩家主页，请稍后重试。
              </EmptyState>
            </div>
          </div>
        </div>
      </section>
    </PlayerDashboardFrame>
  );
}
