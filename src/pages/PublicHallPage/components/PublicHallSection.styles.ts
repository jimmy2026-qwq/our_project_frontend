export const hallSectionClassNames = {
  section:
    'flex h-[calc(100vh-250px)] max-h-[calc(100vh-250px)] min-h-[calc(100vh-250px)] flex-col !rounded-3xl border !border-[rgba(219,175,98,0.28)] !bg-[rgba(9,18,31,0.76)] ![background-image:none] shadow-[0_14px_32px_rgba(5,10,18,0.14),inset_0_1px_0_rgba(255,255,255,0.04)] max-[980px]:h-auto max-[980px]:max-h-none max-[980px]:min-h-0',
  head: 'relative !block items-start',
  headContent: 'grid w-full',
  ornament: 'hidden',
  sourceBadge: 'hidden',
  eyebrow: 'justify-self-start',
  title: 'mt-1.5 w-full text-center',
  description: 'text-center',
  titleRow:
    'grid w-full grid-cols-[1fr_auto_1fr] items-center [&>span]:col-start-2 [&>span]:min-w-[220px] [&>span]:justify-self-center [&>span]:border [&>span]:!border-[rgba(219,175,98,0.46)] [&>span]:bg-[rgba(28,31,68,0.9)] [&>span]:bg-[linear-gradient(180deg,rgba(42,47,90,0.92),rgba(28,31,68,0.9))] [&>span]:px-7 [&>span]:py-2 [&>span]:text-[rgba(239,189,111,0.98)] [&>span]:shadow-[inset_0_1px_0_rgba(255,236,204,0.14),0_6px_16px_rgba(10,12,30,0.14)]',
  createButton:
    'col-start-3 min-h-10 min-w-28 justify-self-end !rounded-none !border !border-[rgba(208,161,89,0.86)] !bg-[linear-gradient(180deg,rgba(235,198,126,0.98),rgba(212,168,95,0.96))] px-4 py-2 !text-[0.9rem] !font-bold !leading-[1.1] !text-[rgba(44,24,8,0.96)] shadow-[inset_0_1px_0_rgba(255,241,208,0.36),0_8px_16px_rgba(37,24,9,0.12)] [text-shadow:none]',
  filters:
    'flex-none items-center gap-x-[18px] gap-y-3 [&_label]:!flex [&_label]:!min-w-0 [&_label]:items-center [&_label]:gap-2.5 [&_label_span]:whitespace-nowrap [&_select]:min-w-[148px]',
  list: 'grid h-full min-h-0 grid-rows-[minmax(0,1fr)] gap-[14px]',
  listBody:
    'grid h-full max-h-full min-h-0 flex-1 content-start gap-[14px] overflow-x-hidden overflow-y-auto pr-2.5 [scrollbar-color:rgba(245,214,146,0.46)_rgba(10,18,31,0.18)] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2.5 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-[rgba(10,18,31,0.18)] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[linear-gradient(180deg,rgba(245,214,146,0.7),rgba(208,170,98,0.7))]',
  row: 'grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-6 gap-y-[14px] rounded-none border-2 !border-[rgba(219,175,98,0.42)] !bg-[rgba(40,62,112,0.24)] ![background-image:none] px-[18px] py-4 shadow-none max-[980px]:grid-cols-1',
  rowMain:
    'grid gap-2 [&_span]:text-[rgba(225,230,243,0.92)] [&_strong]:text-[rgba(239,189,111,0.96)]',
  rowSide:
    'grid min-w-[132px] items-center justify-items-end gap-2 text-[rgba(225,230,243,0.92)] max-[980px]:justify-items-start',
  leaderboardSide:
    'grid min-w-[168px] justify-items-end gap-2 text-[rgba(225,230,243,0.92)] max-[980px]:justify-items-start',
  actionRow:
    'flex flex-nowrap items-center justify-end gap-2.5 max-[980px]:flex-wrap max-[980px]:justify-start',
  action:
    'mt-0 inline-flex min-w-28 cursor-pointer items-center justify-center justify-self-end border !border-[rgba(219,175,98,0.36)] bg-[rgba(56,85,162,0.92)] bg-[linear-gradient(180deg,rgba(83,124,210,0.92),rgba(56,85,162,0.92))] px-[22px] py-2.5 text-center text-[#f5c98e] no-underline',
  status: 'bg-[rgba(114,216,209,0.14)] text-[#8fe8e1]',
};

export const publicHallSectionSlots = {
  ornament: hallSectionClassNames.ornament,
  head: hallSectionClassNames.head,
  headContent: hallSectionClassNames.headContent,
  eyebrow: hallSectionClassNames.eyebrow,
  title: hallSectionClassNames.title,
  description: hallSectionClassNames.description,
  sourceBadge: hallSectionClassNames.sourceBadge,
};
