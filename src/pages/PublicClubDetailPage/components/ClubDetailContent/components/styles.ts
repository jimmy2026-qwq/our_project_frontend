export const clubPanelClassNames = {
  list: 'grid h-full min-h-0 grid-rows-[minmax(0,1fr)] gap-[14px]',
  listBody:
    'grid h-full min-h-0 grid-cols-1 auto-rows-auto content-start justify-stretch gap-[14px] overflow-x-hidden overflow-y-scroll [scrollbar-gutter:stable]',
  row:
    'grid items-center gap-[14px] border-2 !border-[rgba(219,175,98,0.38)] bg-[rgba(28,40,74,0.88)] bg-[linear-gradient(180deg,rgba(29,42,78,0.9),rgba(28,40,74,0.88))] px-[18px] py-4 max-[980px]:grid-cols-1 max-[980px]:items-start min-[981px]:grid-cols-[minmax(0,1fr)_auto]',
  rowMain:
    'grid gap-2 [&_span]:text-[rgba(225,230,243,0.92)] [&_strong]:text-[rgba(239,189,111,0.96)]',
  rowSide:
    'grid min-w-[132px] items-center justify-items-end gap-2 text-[rgba(225,230,243,0.92)] max-[980px]:justify-items-start',
  rowSideMemberAdmin: 'min-w-[260px] max-[980px]:min-w-0',
  actionRow:
    'flex flex-nowrap items-center justify-end gap-2.5 max-[980px]:flex-wrap max-[980px]:justify-start',
  action:
    'mt-0 inline-flex min-w-28 cursor-pointer items-center justify-center border !border-[rgba(219,175,98,0.36)] bg-[rgba(56,85,162,0.92)] bg-[linear-gradient(180deg,rgba(83,124,210,0.92),rgba(56,85,162,0.92))] px-[22px] py-2.5 text-center text-[#f5c98e] no-underline',
  actionGold:
    '!border-[rgba(239,189,111,0.52)] bg-[rgba(176,121,43,0.92)] bg-[linear-gradient(180deg,rgba(239,189,111,0.96),rgba(176,121,43,0.92))] text-[#24180a]',
  actionSecondary:
    'bg-[linear-gradient(180deg,rgba(111,145,219,0.92),rgba(72,98,176,0.92))]',
  actionDanger:
    'bg-[linear-gradient(180deg,rgba(167,86,86,0.92),rgba(126,52,52,0.92))]',
};
