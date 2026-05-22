import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { DetailHero, DetailPageShell, PortalSection } from '@/components/ui';
import { LoadingProgress } from '@/components/ui';

const publicShellClassNames = {
  root: 'grid gap-[22px] text-[#f2f7fb]',
  loadingShell: 'grid gap-[22px]',
  loadingPanel:
    'relative overflow-hidden rounded-[32px] bg-[radial-gradient(circle_at_top_right,rgba(236,197,122,0.14),transparent_30%),linear-gradient(180deg,rgba(20,39,58,0.95),rgba(8,18,29,0.9))] p-[38px] shadow-[0_32px_90px_rgba(0,0,0,0.34)]',
  eyebrow:
    'm-0 text-[0.82rem] uppercase tracking-[0.16em] text-[#ecc57a]',
  loadingTitle:
    'my-3 max-w-[820px] text-[clamp(2rem,4vw,4.2rem)] leading-none text-[#f2f7fb]',
  loadingSummary:
    'm-0 max-w-[62ch] leading-8 text-[#c7d6e2] [text-shadow:0_1px_14px_rgba(3,8,14,0.24)]',
  leaderboardCard:
    'rounded-[28px] border border-[rgba(255,255,255,0.08)] bg-[rgba(14,31,46,0.78)] px-6 py-7 shadow-[0_18px_48px_rgba(0,0,0,0.22)]',
  backLink:
    'inline-flex w-fit text-[#8fe8e1] no-underline hover:text-[#b2f4ef]',
  detailFrame: 'relative isolate',
  detailFrameBackground:
    'pointer-events-none fixed inset-0 -z-20 bg-[url("/tournament_background.png")] bg-cover bg-center bg-no-repeat',
  detailFrameOverlay:
    'pointer-events-none fixed inset-0 -z-10 bg-[linear-gradient(180deg,rgba(8,10,18,0.14),rgba(8,10,18,0.04)_18%,rgba(8,10,18,0.18))]',
};

interface PublicHallLoadingProps {
  eyebrow?: string;
  title?: string;
  summary?: string;
  progressLabel?: string;
  progressMessage?: string;
}

export const PublicHallLoading = ({
  eyebrow = '公共大厅',
  title = '正在加载公共大厅...',
  summary = '正在同步公开赛程、俱乐部卡片和排行榜数据。',
  progressLabel = '公共大厅加载中',
  progressMessage = '请稍候，我们正在同步公共大厅首页所需的数据。',
}: PublicHallLoadingProps = {}) => {
  return (
    <section className={publicShellClassNames.root}>
      <section className={publicShellClassNames.loadingShell}>
        <div className={publicShellClassNames.loadingPanel}>
          <p className={publicShellClassNames.eyebrow}>{eyebrow}</p>
          <h1 className={publicShellClassNames.loadingTitle}>{title}</h1>
          <p className={publicShellClassNames.loadingSummary}>{summary}</p>
          <LoadingProgress
            className="mt-6 max-w-[420px]"
            label={progressLabel}
            message={progressMessage}
            indeterminate
            tone="warm"
          />
        </div>
      </section>
    </section>
  );
};

export const PublicHallError = ({ message }: { message: string }) => {
  return (
    <section className={publicShellClassNames.root}>
      <section className={publicShellClassNames.loadingShell}>
        <div className={publicShellClassNames.loadingPanel}>
          <p className={publicShellClassNames.eyebrow}>公共大厅</p>
          <h1 className={publicShellClassNames.loadingTitle}>
            公共大厅加载失败
          </h1>
          <p className={publicShellClassNames.loadingSummary}>{message}</p>
        </div>
      </section>
    </section>
  );
};

export const PublicHallLeaderboardLoading = () => {
  return (
    <PortalSection
      eyebrow="排行榜"
      title="选手排行榜"
      description="正在获取公共大厅的最新排行榜数据。"
      source="api"
    >
      <div className={publicShellClassNames.leaderboardCard}>
        <LoadingProgress
          label="排行榜加载中"
          message="正在获取最新的选手排名数据。"
          indeterminate
        />
      </div>
    </PortalSection>
  );
};

export const PublicDetailPageFrame = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <div className={publicShellClassNames.detailFrame}>
      <span
        className={publicShellClassNames.detailFrameBackground}
        aria-hidden="true"
      />
      <span
        className={publicShellClassNames.detailFrameOverlay}
        aria-hidden="true"
      />
      {children}
    </div>
  );
};

export const PublicDetailNotFound = ({ title }: { title: string }) => {
  return (
    <DetailPageShell
      backLink={
        <Link className={publicShellClassNames.backLink} to="/public">
          返回公共大厅
        </Link>
      }
      hero={
        <DetailHero
          eyebrow="未找到"
          title={title}
          summary="当前无法找到你请求的公共详情页面。"
        />
      }
    />
  );
};
