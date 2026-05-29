export const detailShellClassNames = {
  page: 'relative isolate',
  pageBackground:
    "pointer-events-none fixed inset-0 -z-20 bg-[url('/tournament_background.png')] bg-cover bg-center bg-no-repeat",
  pageOverlay:
    'pointer-events-none fixed inset-0 -z-10 bg-[linear-gradient(180deg,rgba(8,10,18,0.14),rgba(8,10,18,0.04)_18%,rgba(8,10,18,0.18))]',
  shell: 'relative grid gap-[18px] text-[#f2f7fb]',
  header:
    'relative grid min-h-[52px] grid-cols-[132px_minmax(0,1fr)] items-center gap-[14px] max-[980px]:min-h-0 max-[980px]:grid-cols-1',
  back: 'fixed left-7 top-6 z-[5] inline-flex min-h-12 items-center justify-center border-2 !border-[rgba(219,175,98,0.4)] bg-[rgba(28,40,74,0.88)] bg-[linear-gradient(180deg,rgba(29,42,78,0.9),rgba(28,40,74,0.88))] px-[18px] text-[rgba(239,189,111,0.96)] no-underline shadow-none max-[980px]:static',
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
  navItemActive:
    '!border-[rgba(239,189,111,0.5)] text-[rgba(239,189,111,0.96)]',
  content:
    'relative z-[1] box-border grid h-[calc(100vh-190px)] max-h-[calc(100vh-190px)] min-h-[calc(100vh-190px)] grid-rows-[minmax(0,1fr)] overflow-hidden rounded-3xl border-2 !border-[rgba(219,175,98,0.4)] bg-[rgba(9,18,31,0.48)] bg-[linear-gradient(180deg,rgba(13,24,40,0.72),rgba(11,20,34,0.64))] px-[22px] py-[18px] shadow-[0_18px_42px_rgba(5,10,18,0.14),inset_0_1px_0_rgba(255,255,255,0.05)] max-[980px]:h-auto max-[980px]:max-h-none max-[980px]:min-h-0 max-[980px]:overflow-visible',
  panel:
    'box-border grid h-full max-h-full min-h-0 grid-rows-[minmax(0,1fr)] overflow-hidden border-2 !border-[rgba(219,175,98,0.32)] bg-[rgba(15,24,46,0.52)] p-[18px] [scrollbar-gutter:stable]',
  panelFull: 'min-h-full',
  homeGrid:
    'grid items-start gap-[18px] min-[981px]:grid-cols-[minmax(300px,0.9fr)_minmax(0,1.1fr)]',
  card: 'mt-0 flex flex-col rounded-3xl border-2 !border-[rgba(219,175,98,0.32)] bg-[rgba(18,28,52,0.72)] p-[22px] text-[#f2f7fb] shadow-none backdrop-blur-[18px]',
  cardHeader: 'p-[22px] pb-0',
  cardTitle: 'text-[#f2f7fb]',
  cardContent: 'p-[22px] pt-4',
  detailList: 'm-0 grid gap-3 p-0',
  detailItem:
    '[&_dt]:text-[#c7d6e2] [&_dt]:[text-shadow:0_1px_12px_rgba(3,8,14,0.18)] [&_dd]:m-0 [&_dd]:font-semibold [&_dd]:text-[#f2f7fb]',
  list: 'grid h-full min-h-0 grid-rows-[minmax(0,1fr)] gap-[14px]',
  listBody:
    'grid h-full min-h-0 grid-cols-1 auto-rows-auto content-start justify-stretch gap-[14px] overflow-x-hidden overflow-y-scroll [scrollbar-gutter:stable]',
  listRow:
    'grid items-center gap-[14px] border-2 !border-[rgba(219,175,98,0.38)] bg-[rgba(28,40,74,0.88)] bg-[linear-gradient(180deg,rgba(29,42,78,0.9),rgba(28,40,74,0.88))] px-[18px] py-4 max-[980px]:grid-cols-1 max-[980px]:items-start min-[981px]:grid-cols-[minmax(0,1fr)_auto]',
  listRowMain:
    'grid gap-2 [&_span]:text-[rgba(225,230,243,0.92)] [&_strong]:text-[rgba(239,189,111,0.96)]',
  listRowSide:
    'grid min-w-[132px] items-center justify-items-end gap-2 text-[rgba(225,230,243,0.92)] max-[980px]:justify-items-start',
  actionRow:
    'flex flex-nowrap items-center justify-end gap-2.5 max-[980px]:flex-wrap max-[980px]:justify-start',
  action:
    'mt-0 inline-flex min-w-28 cursor-pointer items-center justify-center border !border-[rgba(219,175,98,0.36)] bg-[rgba(56,85,162,0.92)] bg-[linear-gradient(180deg,rgba(83,124,210,0.92),rgba(56,85,162,0.92))] px-[22px] py-2.5 text-center text-[#f5c98e] no-underline',
  actionDisabled:
    'mt-0 inline-flex min-w-28 cursor-not-allowed items-center justify-center border !border-[rgba(219,175,98,0.22)] bg-[rgba(67,74,95,0.56)] bg-[linear-gradient(180deg,rgba(92,102,126,0.56),rgba(67,74,95,0.56))] px-[22px] py-2.5 text-center text-[rgba(225,230,243,0.62)]',
};

export const loadingClassNames = {
  portal: 'grid gap-[22px] text-[#f2f7fb]',
  hero: 'relative z-[1] mx-auto grid w-[min(100%,1480px)] gap-[22px]',
  main: 'relative mx-auto w-full max-w-[1180px] overflow-hidden rounded-[32px] border !border-[rgba(246,212,136,0.28)] bg-[radial-gradient(circle_at_top_right,rgba(236,197,122,0.14),transparent_30%),linear-gradient(180deg,rgba(20,39,58,0.95),rgba(8,18,29,0.9))] px-11 pb-10 pt-[42px] shadow-[0_32px_90px_rgba(0,0,0,0.34)] backdrop-blur-[18px]',
  mainBorder:
    'pointer-events-none absolute inset-2.5 rounded-[26px] border !border-[rgba(255,240,209,0.08)]',
  eyebrow:
    'relative z-[1] m-0 text-[0.82rem] uppercase tracking-[0.16em] text-[#ecc57a]',
  title:
    'relative z-[1] my-3 max-w-none whitespace-nowrap text-[clamp(2.6rem,4vw,4.3rem)] leading-[0.98] tracking-[-0.04em] text-[#f2f7fb] [text-shadow:0_10px_28px_rgba(3,8,14,0.34)] max-[980px]:whitespace-normal max-[980px]:text-[clamp(2.3rem,10vw,3.6rem)]',
  summary:
    'relative z-[1] m-0 max-w-[72ch] leading-[1.8] text-[#c7d6e2] [text-shadow:0_1px_14px_rgba(3,8,14,0.24)]',
};
