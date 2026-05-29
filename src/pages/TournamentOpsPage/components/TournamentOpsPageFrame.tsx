import type { ReactNode } from 'react';

import { SectionIntro } from '@/components/ui';

const tournamentOpsSectionClassName =
  'grid gap-[22px] rounded-[32px] bg-[rgba(9,21,33,0.86)] px-[30px] py-7';

export function TournamentOpsPageFrame({ children }: { children: ReactNode }) {
  return (
    <section className={tournamentOpsSectionClassName}>
      <SectionIntro
        eyebrow="赛事运营"
        title="赛事运营"
        description="在一个工作台里查看当前阶段的对局、记录、申诉和准备状态。"
      />

      {children}
    </section>
  );
}
