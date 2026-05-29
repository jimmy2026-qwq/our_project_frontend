import type { ReactNode } from 'react';

const memberHubPageClassName =
  'grid gap-[22px] rounded-[32px] bg-[rgba(9,21,33,0.86)] px-[30px] py-7';

export function MemberHubPageShell({ children }: { children: ReactNode }) {
  return <section className={memberHubPageClassName}>{children}</section>;
}
