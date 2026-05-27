import { LoadingProgress, PortalSection } from '@/components/ui';

const hallLoadingClassNames = {
  root: 'grid gap-[22px] text-[#f2f7fb]',
  shell: 'grid gap-[22px]',
  panel:
    'relative overflow-hidden rounded-[32px] bg-[radial-gradient(circle_at_top_right,rgba(236,197,122,0.14),transparent_30%),linear-gradient(180deg,rgba(20,39,58,0.95),rgba(8,18,29,0.9))] p-[38px] shadow-[0_32px_90px_rgba(0,0,0,0.34)]',
  eyebrow:
    'm-0 text-[0.82rem] uppercase tracking-[0.16em] text-[#ecc57a]',
  title:
    'my-3 max-w-[820px] text-[clamp(2rem,4vw,4.2rem)] leading-none text-[#f2f7fb]',
  summary:
    'm-0 max-w-[62ch] leading-8 text-[#c7d6e2] [text-shadow:0_1px_14px_rgba(3,8,14,0.24)]',
  leaderboardCard:
    'rounded-[28px] border border-[rgba(255,255,255,0.08)] bg-[rgba(14,31,46,0.78)] px-6 py-7 shadow-[0_18px_48px_rgba(0,0,0,0.22)]',
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
    <section className={hallLoadingClassNames.root}>
      <section className={hallLoadingClassNames.shell}>
        <div className={hallLoadingClassNames.panel}>
          <p className={hallLoadingClassNames.eyebrow}>{eyebrow}</p>
          <h1 className={hallLoadingClassNames.title}>{title}</h1>
          <p className={hallLoadingClassNames.summary}>{summary}</p>
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
    <section className={hallLoadingClassNames.root}>
      <section className={hallLoadingClassNames.shell}>
        <div className={hallLoadingClassNames.panel}>
          <p className={hallLoadingClassNames.eyebrow}>公共大厅</p>
          <h1 className={hallLoadingClassNames.title}>公共大厅加载失败</h1>
          <p className={hallLoadingClassNames.summary}>{message}</p>
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
      <div className={hallLoadingClassNames.leaderboardCard}>
        <LoadingProgress
          label="排行榜加载中"
          message="正在获取最新的选手排名数据。"
          indeterminate
        />
      </div>
    </PortalSection>
  );
};
