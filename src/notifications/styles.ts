export const notificationCenterClassNames = {
  trigger:
    'fixed right-5 top-5 z-50 inline-flex h-12 w-12 items-center justify-center rounded-[14px] border-2 !border-[rgba(190,142,72,0.95)] bg-[rgba(190,138,67,0.98)] bg-[linear-gradient(180deg,rgba(232,184,100,0.98),rgba(171,114,55,0.98))] text-[1.5rem] font-black leading-none text-[rgba(92,50,47,0.98)] shadow-[inset_0_1px_0_rgba(255,232,178,0.34),0_8px_14px_rgba(17,20,52,0.19),0_16px_40px_rgba(0,0,0,0.23)] transition-[transform,filter] duration-200 hover:-translate-y-0.5 hover:saturate-[1.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(232,184,100,0.66)]',
  triggerIcon: 'relative top-[-1px] block',
  unread:
    'absolute -right-2 -top-2 grid min-h-5 min-w-5 place-items-center rounded-full border-2 !border-[rgba(72,24,24,0.96)] bg-[rgba(255,76,76,0.96)] px-1.5 text-[0.68rem] font-black leading-none text-white shadow-[0_5px_10px_rgba(39,8,8,0.24)]',
  panel:
    'fixed right-5 top-[74px] z-50 grid max-h-[min(620px,calc(100vh_-_96px))] w-[min(420px,calc(100vw_-_40px))] grid-rows-[auto_1fr] overflow-hidden rounded-[8px] border border-[rgba(176,223,229,0.18)] bg-[rgba(5,14,23,0.96)] shadow-[0_24px_70px_rgba(0,0,0,0.42)] backdrop-blur-xl',
  header:
    'flex items-center justify-between gap-3 border-b border-[rgba(176,223,229,0.12)] px-5 py-4',
  title: 'text-[1rem] font-semibold text-[#f2f7fb]',
  body: 'min-h-0 overflow-y-auto',
  empty: 'px-5 py-10 text-center text-[0.9rem] text-[#9bb8c6]',
  item:
    'grid gap-2 border-b border-[rgba(176,223,229,0.1)] px-5 py-4 text-left transition-colors hover:bg-[rgba(255,255,255,0.04)]',
  unreadItem: 'bg-[rgba(114,216,209,0.06)]',
  itemTop: 'flex items-start justify-between gap-3',
  itemTitle: 'text-[0.95rem] font-semibold text-[#f2f7fb]',
  itemBody: 'text-[0.86rem] leading-6 text-[#b7ccd7]',
  meta: 'flex items-center justify-between gap-3 text-[0.78rem] text-[#7f9dac]',
};
