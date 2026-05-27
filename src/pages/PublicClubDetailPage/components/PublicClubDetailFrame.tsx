import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { DetailHero, DetailPageShell, LoadingProgress } from '@/components/ui';

const clubDetailFrameClassNames = {
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

export const PublicClubDetailFrame = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <div className={clubDetailFrameClassNames.root}>
      <span className={clubDetailFrameClassNames.background} aria-hidden="true" />
      <span className={clubDetailFrameClassNames.overlay} aria-hidden="true" />
      {children}
    </div>
  );
};

export const PublicClubDetailLoading = () => {
  return (
    <section className={clubDetailFrameClassNames.loadingRoot}>
      <section className={clubDetailFrameClassNames.loadingShell}>
        <div className={clubDetailFrameClassNames.loadingPanel}>
          <p className={clubDetailFrameClassNames.eyebrow}>俱乐部详情</p>
          <h1 className={clubDetailFrameClassNames.title}>
            正在载入俱乐部详情...
          </h1>
          <p className={clubDetailFrameClassNames.summary}>
            正在同步俱乐部公开信息、近期赛事和成员管理数据。
          </p>
          <LoadingProgress
            className="mt-6 max-w-[420px]"
            label="俱乐部详情加载中"
            message="加载完成后会直接进入新的详情界面。"
            indeterminate
            tone="warm"
          />
        </div>
      </section>
    </section>
  );
};

export const PublicClubDetailNotFound = ({ title }: { title: string }) => {
  return (
    <DetailPageShell
      backLink={
        <Link className={clubDetailFrameClassNames.backLink} to="/public">
          返回公共大厅
        </Link>
      }
      hero={
        <DetailHero
          eyebrow="未找到"
          title={title}
          summary="当前无法找到你请求的俱乐部详情页面。"
        />
      }
    />
  );
};
