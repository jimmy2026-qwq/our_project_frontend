export const detailShellClassNames = {
  shell: 'relative grid gap-[18px] text-[#f2f7fb]',
  header:
    'relative grid min-h-[52px] grid-cols-[132px_minmax(0,1fr)] items-center gap-[14px] max-[980px]:min-h-0 max-[980px]:grid-cols-1',
  back:
    'fixed left-7 top-6 z-[5] inline-flex min-h-12 items-center justify-center border-2 !border-[rgba(219,175,98,0.4)] bg-[rgba(28,40,74,0.88)] bg-[linear-gradient(180deg,rgba(29,42,78,0.9),rgba(28,40,74,0.88))] px-[18px] text-[rgba(239,189,111,0.96)] shadow-none max-[980px]:static',
  title:
    'col-start-2 inline-flex min-h-[52px] min-w-[min(100%,640px)] items-center justify-center justify-self-center border-2 !border-[rgba(219,175,98,0.4)] bg-[rgba(28,40,74,0.58)] bg-[linear-gradient(180deg,rgba(29,42,78,0.74),rgba(28,40,74,0.64))] px-9 text-center text-[1.42rem] font-bold text-[rgba(239,189,111,0.98)] shadow-none max-[980px]:col-auto',
  headerActions:
    'absolute right-0 top-1/2 flex -translate-y-1/2 flex-wrap justify-end gap-2.5 max-[980px]:static max-[980px]:translate-y-0',
  frame:
    'grid grid-cols-[132px_minmax(0,1fr)] items-start max-[980px]:grid-cols-1 max-[980px]:gap-[18px]',
  sidebar:
    'relative z-[2] -ml-[72px] grid content-start gap-[14px] overflow-y-auto pt-[22px] max-[980px]:ml-0 max-[980px]:pt-0',
  navItem:
    'relative z-[1] min-h-[72px] cursor-pointer border-2 !border-[rgba(219,175,98,0.4)] bg-[rgba(28,40,74,0.88)] bg-[linear-gradient(180deg,rgba(29,42,78,0.9),rgba(28,40,74,0.88))] px-[18px] py-[14px] text-center !text-[1.18rem] !font-bold tracking-[0.04em] text-[rgba(225,230,243,0.92)] max-[980px]:border-r-2',
  navItemActive: '!border-[rgba(239,189,111,0.5)] text-[rgba(239,189,111,0.96)]',
  content:
    'relative z-[1] box-border grid h-[calc(100vh-190px)] max-h-[calc(100vh-190px)] min-h-[calc(100vh-190px)] grid-rows-[minmax(0,1fr)] overflow-hidden rounded-3xl border-2 !border-[rgba(219,175,98,0.4)] bg-[rgba(9,18,31,0.48)] bg-[linear-gradient(180deg,rgba(13,24,40,0.72),rgba(11,20,34,0.64))] px-[22px] py-[18px] shadow-[0_18px_42px_rgba(5,10,18,0.14),inset_0_1px_0_rgba(255,255,255,0.05)] max-[980px]:h-auto max-[980px]:max-h-none max-[980px]:min-h-0 max-[980px]:overflow-visible',
  contentWithAside:
    'grid-cols-[minmax(0,1.6fr)_minmax(280px,0.9fr)] gap-[18px] max-[980px]:grid-cols-1',
  panel:
    'box-border grid h-full max-h-full min-h-0 grid-rows-[minmax(0,1fr)] overflow-hidden border-2 !border-[rgba(219,175,98,0.32)] bg-[rgba(15,24,46,0.52)] p-[18px] [scrollbar-gutter:stable]',
  panelFull: 'min-h-full',
  list: 'grid h-full min-h-0 grid-rows-[minmax(0,1fr)] gap-[14px]',
  listBody:
    'grid h-full min-h-0 grid-cols-1 auto-rows-auto content-start justify-stretch gap-[14px] overflow-x-hidden overflow-y-scroll [scrollbar-gutter:stable]',
  panelBody:
    'grid h-full max-h-full min-h-0 content-start gap-[14px] overflow-x-hidden overflow-y-auto pr-2.5 [scrollbar-gutter:stable]',
  row:
    'grid items-center gap-[14px] border-2 !border-[rgba(219,175,98,0.38)] bg-[rgba(28,40,74,0.88)] bg-[linear-gradient(180deg,rgba(29,42,78,0.9),rgba(28,40,74,0.88))] px-[18px] py-4 max-[980px]:grid-cols-1 max-[980px]:items-start min-[981px]:grid-cols-[minmax(0,1fr)_auto]',
  rowMain:
    'grid gap-2 [&_span]:text-[rgba(225,230,243,0.92)] [&_strong]:text-[rgba(239,189,111,0.96)]',
  rowSide:
    'grid min-w-[132px] items-center justify-items-end gap-2 text-[rgba(225,230,243,0.92)] max-[980px]:justify-items-start',
  actionRow:
    'flex flex-nowrap items-center justify-end gap-2.5 max-[980px]:flex-wrap max-[980px]:justify-start',
  action:
    'mt-0 inline-flex min-w-28 cursor-pointer items-center justify-center border !border-[rgba(219,175,98,0.36)] bg-[rgba(56,85,162,0.92)] bg-[linear-gradient(180deg,rgba(83,124,210,0.92),rgba(56,85,162,0.92))] px-[22px] py-2.5 text-center text-[#f5c98e] no-underline',
  actionPrepare:
    'bg-[linear-gradient(180deg,rgba(232,191,108,0.96),rgba(193,142,54,0.94))] text-[rgba(67,38,12,0.96)]',
  actionReady:
    'bg-[linear-gradient(180deg,rgba(83,124,210,0.92),rgba(56,85,162,0.92))] text-[#f5c98e]',
  actionDisabled:
    'mt-0 inline-flex min-w-28 cursor-not-allowed items-center justify-center border !border-[rgba(219,175,98,0.22)] bg-[rgba(67,74,95,0.56)] bg-[linear-gradient(180deg,rgba(92,102,126,0.56),rgba(67,74,95,0.56))] px-[22px] py-2.5 text-center text-[rgba(225,230,243,0.62)]',
  seatRow:
    'grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-4 border-t border-[rgba(219,175,98,0.16)] py-[14px] first:border-t-0 max-[980px]:grid-cols-1',
};
