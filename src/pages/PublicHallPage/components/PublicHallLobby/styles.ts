export const lobbyClassNames = {
  portal:
    'relative z-[1] grid min-h-[calc(100vh-72px)] gap-7 overflow-hidden text-[#f2f7fb]',
  glow:
    'pointer-events-none absolute right-[18px] top-2.5 h-[200px] w-[200px] bg-[radial-gradient(circle,rgba(247,214,135,0.24),rgba(247,214,135,0)_68%)] blur-[10px]',
  playerCard:
    'fixed left-5 top-5 z-[4] grid min-h-[116px] w-[min(268px,calc(100vw-28px))] grid-cols-[minmax(0,1fr)_auto] items-center overflow-hidden border-0 bg-[rgba(24,32,78,0.94)] bg-[linear-gradient(180deg,rgba(48,87,154,0.18),rgba(48,87,154,0)_24%),linear-gradient(180deg,rgba(25,38,88,0.96),rgba(24,32,78,0.94))] py-[14px] pl-6 pr-4 shadow-[0_16px_30px_rgba(7,12,20,0.18),inset_0_1px_0_rgba(255,240,209,0.16)] [clip-path:polygon(4%_0,96%_0,100%_14%,100%_86%,96%_100%,4%_100%,0_86%,0_14%)] max-[980px]:relative max-[980px]:left-auto max-[980px]:top-auto max-[980px]:w-full',
  playerCardOuter:
    'pointer-events-none absolute inset-0 border-2 !border-[rgba(219,175,98,0.9)] [clip-path:inherit]',
  playerCardInner:
    'pointer-events-none absolute inset-1.5 border !border-[rgba(219,175,98,0.4)] bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0)_22%),linear-gradient(135deg,rgba(255,255,255,0.035)_25%,transparent_25%),linear-gradient(225deg,rgba(255,255,255,0.035)_25%,transparent_25%)] bg-[length:auto,24px_24px,24px_24px] opacity-75 [clip-path:inherit]',
  playerCopy:
    'relative z-[1] grid w-full justify-items-center gap-2 py-1 pl-1.5 pr-4 text-center',
  playerMeta:
    'm-0 grid w-[min(100%,220px)] justify-items-center gap-[3px] border-b !border-[rgba(210,173,99,0.48)] pb-[9px] shadow-[inset_0_-1px_0_rgba(46,57,118,0.72)] [&_span]:text-[0.94rem] [&_span]:font-bold [&_span]:uppercase [&_span]:tracking-[0.06em] [&_span]:text-[rgba(228,232,255,0.82)]',
  playerLink:
    'inline-flex w-full justify-center text-[clamp(1.1rem,1.9vw,1.35rem)] font-bold leading-[1.05] tracking-[0.02em] text-[#f7f3ff] no-underline [text-shadow:0_8px_18px_rgba(3,8,14,0.26)]',
  playerAvatar:
    'relative z-[1] mr-2 inline-flex h-12 w-12 items-center justify-center rounded-[14px] border-2 !border-[rgba(220,176,100,0.92)] bg-[rgba(230,185,104,0.96)] bg-[linear-gradient(180deg,rgba(255,228,165,0.98),rgba(230,185,104,0.96))] no-underline shadow-[inset_0_1px_0_rgba(255,247,223,0.4),0_8px_14px_rgba(17,20,52,0.18)]',
  playerLogin:
    'relative z-[1] mr-2 inline-flex h-12 min-w-[86px] items-center justify-center rounded-[14px] border-2 !border-[rgba(220,176,100,0.92)] bg-[rgba(231,184,88,0.96)] bg-[linear-gradient(180deg,rgba(255,234,183,0.98),rgba(231,184,88,0.96))] px-[18px] text-[0.94rem] font-extrabold tracking-[0.08em] text-[rgba(105,50,35,0.98)] no-underline shadow-[inset_0_1px_0_rgba(255,247,223,0.4),0_8px_14px_rgba(17,20,52,0.18)]',
  avatarIcon:
    'relative block h-[22px] w-[22px] text-[rgba(123,74,75,0.96)]',
  avatarIconHead:
    'absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 rounded-full bg-current',
  avatarIconBody:
    'absolute bottom-0 left-1/2 h-3 w-5 -translate-x-1/2 rounded-[12px_12px_7px_7px] bg-current',
  lobby:
    'relative z-[1] mt-[116px] grid grid-cols-[minmax(0,7fr)_minmax(0,3fr)] items-start gap-6 bg-transparent p-6 shadow-none backdrop-blur-none max-[980px]:mt-24 max-[980px]:grid-cols-1 max-[980px]:p-[18px]',
  main: 'grid min-h-0 gap-[22px]',
  sidebar: 'grid min-h-0 gap-[22px]',
  stage:
    'relative z-[1] h-[calc(100vh-250px)] max-h-[calc(100vh-250px)] min-h-[calc(100vh-250px)] min-w-0 max-[980px]:h-auto max-[980px]:max-h-none max-[980px]:min-h-0',
  stageScroll:
    'h-full max-h-full min-h-full overflow-hidden pr-0 max-[980px]:h-auto max-[980px]:overflow-visible',
  menu: 'relative top-0 grid gap-6 max-[980px]:static',
  menuButton:
    'relative isolate grid min-h-[174px] cursor-pointer content-start gap-3 border-0 bg-transparent p-0 text-left text-[#ffe8cf] shadow-none transition-[transform,filter] duration-200 hover:-translate-y-[3px]',
  menuButtonActive: '-translate-y-[3px] saturate-[1.04]',
  menuFrame:
    'pointer-events-none absolute inset-0 z-0 rounded-[30px] bg-[rgba(177,112,55,0.98)] bg-[linear-gradient(180deg,rgba(255,214,138,0.98),rgba(177,112,55,0.98))] shadow-[0_14px_24px_rgba(45,15,14,0.22),inset_0_-1px_0_rgba(125,64,30,0.8)] [clip-path:polygon(5%_0,95%_0,100%_10%,100%_88%,95%_100%,5%_100%,0_88%,0_10%)]',
  menuFrameInner:
    'absolute inset-1 rounded-[26px] bg-[rgba(72,24,24,0.98)] bg-[linear-gradient(180deg,rgba(92,31,28,0.98),rgba(72,24,24,0.98))] shadow-[inset_0_1px_0_rgba(255,225,183,0.36),inset_0_-10px_16px_rgba(36,12,12,0.28)] [clip-path:inherit]',
  menuSurface:
    'pointer-events-none absolute inset-x-4 bottom-[26px] top-[14px] z-[1] overflow-hidden rounded-3xl bg-[rgba(89,28,27,0.98)] bg-[linear-gradient(180deg,rgba(111,36,31,0.98),rgba(89,28,27,0.98))] shadow-[inset_0_1px_0_rgba(255,213,180,0.18),inset_0_-18px_24px_rgba(59,16,16,0.28)] [clip-path:polygon(5%_0,95%_0,100%_11%,100%_88%,95%_100%,5%_100%,0_88%,0_11%)]',
  menuSurfacePattern:
    'pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,214,188,0.06),rgba(255,214,188,0)_24%),linear-gradient(135deg,rgba(255,184,150,0.045)_25%,transparent_25%),linear-gradient(225deg,rgba(255,184,150,0.045)_25%,transparent_25%),linear-gradient(315deg,rgba(0,0,0,0.04)_25%,transparent_25%),linear-gradient(45deg,rgba(0,0,0,0.04)_25%,transparent_25%)] bg-[length:auto,26px_26px,26px_26px,26px_26px,26px_26px] opacity-95',
  menuFlower:
    'pointer-events-none absolute z-[3] h-10 w-10 bg-[rgba(212,150,76,0.98)] bg-[linear-gradient(180deg,rgba(255,221,146,0.98),rgba(212,150,76,0.98))] [clip-path:polygon(50%_0,63%_21%,86%_8%,79%_32%,100%_50%,79%_68%,86%_92%,63%_79%,50%_100%,37%_79%,14%_92%,21%_68%,0_50%,21%_32%,14%_8%,37%_21%)] [filter:drop-shadow(0_5px_8px_rgba(61,19,16,0.22))]',
  menuFlowerLeft: '-left-2 -top-2.5 -rotate-[14deg]',
  menuFlowerRight: '-right-2 bottom-[18px] rotate-[14deg]',
  menuAlert: 'relative z-[2] hidden',
  menuCopy:
    'relative z-[2] grid justify-items-center gap-2 px-[30px] pt-6 text-center',
  menuEyebrow:
    'block text-[0.76rem] uppercase tracking-[0.16em] text-[rgba(255,221,197,0.72)]',
  menuTitle:
    'mt-0.5 block text-center [font-family:"YouYuan","STSong","SimSun","Noto_Serif_SC",serif] text-[clamp(2.1rem,2.9vw,2.65rem)] font-extrabold leading-[1.02] tracking-[0.12em] text-[#ffd2c8] [text-shadow:0_2px_0_rgba(150,46,57,0.82),0_4px_0_rgba(132,36,46,0.76),0_6px_0_rgba(108,28,37,0.56),0_8px_16px_rgba(57,16,16,0.2)]',
  menuTag:
    'absolute -bottom-1.5 left-1/2 z-[3] inline-flex min-h-11 min-w-[186px] -translate-x-1/2 items-center justify-center rounded-2xl border-2 !border-[rgba(212,148,79,0.95)] bg-[rgba(84,28,24,0.98)] px-[26px] py-2 text-[0.86rem] font-bold tracking-[0.08em] text-[rgba(255,240,229,0.96)] shadow-[inset_0_1px_0_rgba(255,220,186,0.2),0_8px_14px_rgba(47,16,15,0.16)]',
};
