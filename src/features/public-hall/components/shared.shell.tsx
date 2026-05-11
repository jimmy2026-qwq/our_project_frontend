import { Link } from 'react-router-dom';

import { DetailHero, DetailPageShell, PortalSection } from '@/components/shared/data-display';
import { LoadingProgress } from '@/components/ui';

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
    <section className="public-portal">
      <section className="portal-hero portal-hero--loading grid gap-[22px]">
        <div className="portal-hero__main relative overflow-hidden rounded-[var(--radius-xl)] p-[38px] shadow-[var(--shadow-lg)] bg-[radial-gradient(circle_at_top_right,rgba(236,197,122,0.14),transparent_30%),linear-gradient(180deg,rgba(20,39,58,0.95),rgba(8,18,29,0.9))]">
          <p className="portal-hero__eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="portal-hero__summary">{summary}</p>
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
    <section className="public-portal">
      <section className="portal-hero portal-hero--loading grid gap-[22px]">
        <div className="portal-hero__main relative overflow-hidden rounded-[var(--radius-xl)] p-[38px] shadow-[var(--shadow-lg)] bg-[radial-gradient(circle_at_top_right,rgba(236,197,122,0.14),transparent_30%),linear-gradient(180deg,rgba(20,39,58,0.95),rgba(8,18,29,0.9))]">
          <p className="portal-hero__eyebrow">公共大厅</p>
          <h1>公共大厅加载失败</h1>
          <p className="portal-hero__summary">{message}</p>
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
      <div className="rounded-[28px] border border-[rgba(255,255,255,0.08)] bg-[color:var(--panel)] px-6 py-7 shadow-[var(--shadow-md)]">
        <LoadingProgress
          label="排行榜加载中"
          message="正在获取最新的选手排名数据。"
          indeterminate
        />
      </div>
    </PortalSection>
  );
};

export const PublicDetailNotFound = ({ title }: { title: string }) => {
  return (
    <DetailPageShell
      backLink={
        <Link className="detail-back" to="/public">
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
