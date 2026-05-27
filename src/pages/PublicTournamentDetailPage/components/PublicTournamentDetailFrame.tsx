import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { DetailHero, DetailPageShell, LoadingProgress } from '@/components/ui';

const tournamentDetailFrameClassNames = {
  root: 'relative isolate',
  background:
    'pointer-events-none fixed inset-0 -z-20 bg-[url("/tournament_background.png")] bg-cover bg-center bg-no-repeat',
  overlay:
    'pointer-events-none fixed inset-0 -z-10 bg-[linear-gradient(180deg,rgba(8,10,18,0.14),rgba(8,10,18,0.04)_18%,rgba(8,10,18,0.18))]',
  loadingRoot: 'grid gap-[22px] text-[#f2f7fb]',
  loadingShell: 'grid gap-[22px]',
  loadingPanel:
    'relative overflow-hidden rounded-[32px] bg-[radial-gradient(circle_at_top_right,rgba(236,197,122,0.14),transparent_30%),linear-gradient(180deg,rgba(20,39,58,0.95),rgba(8,18,29,0.9))] p-[38px] shadow-[0_32px_90px_rgba(0,0,0,0.34)]',
  eyebrow:
    'm-0 text-[0.82rem] uppercase tracking-[0.16em] text-[#ecc57a]',
  title:
    'my-3 max-w-[820px] text-[clamp(2rem,4vw,4.2rem)] leading-none text-[#f2f7fb]',
  summary:
    'm-0 max-w-[62ch] leading-8 text-[#c7d6e2] [text-shadow:0_1px_14px_rgba(3,8,14,0.24)]',
  backLink:
    'inline-flex w-fit text-[#8fe8e1] no-underline hover:text-[#b2f4ef]',
};

export const PublicTournamentDetailFrame = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <div className={tournamentDetailFrameClassNames.root}>
      <span
        className={tournamentDetailFrameClassNames.background}
        aria-hidden="true"
      />
      <span
        className={tournamentDetailFrameClassNames.overlay}
        aria-hidden="true"
      />
      {children}
    </div>
  );
};

export const PublicTournamentDetailLoading = () => {
  return (
    <section className={tournamentDetailFrameClassNames.loadingRoot}>
      <section className={tournamentDetailFrameClassNames.loadingShell}>
        <div className={tournamentDetailFrameClassNames.loadingPanel}>
          <p className={tournamentDetailFrameClassNames.eyebrow}>赛事详情</p>
          <h1 className={tournamentDetailFrameClassNames.title}>
            正在加载赛事详情...
          </h1>
          <p className={tournamentDetailFrameClassNames.summary}>
            正在同步赛事信息、阶段数据和管理视图。
          </p>
          <LoadingProgress
            className="mt-6 max-w-[420px]"
            label="赛事详情加载中"
            message="正在获取赛事详情、阶段配置和当前桌次信息。"
            indeterminate
            tone="warm"
          />
        </div>
      </section>
    </section>
  );
};

export const PublicTournamentDetailNotFound = ({
  title,
}: {
  title: string;
}) => {
  return (
    <DetailPageShell
      backLink={
        <Link className={tournamentDetailFrameClassNames.backLink} to="/public">
          返回公共大厅
        </Link>
      }
      hero={
        <DetailHero
          eyebrow="未找到"
          title={title}
          summary="当前无法找到你请求的赛事详情页面。"
        />
      }
    />
  );
};
