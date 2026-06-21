import type { ReactNode } from 'react';

const memberHubPageClassName =
  'grid gap-[22px] rounded-[32px] bg-[rgba(9,21,33,0.86)] px-[30px] py-7';

/** 成员中心页面的整体背景和内容宽度容器。 */
export function MemberHubPageShell({ children }: { children: ReactNode }) {
  return <section className={memberHubPageClassName}>{children}</section>;
}
