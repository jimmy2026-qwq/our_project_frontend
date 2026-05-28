const bangziImages = {
  honba: '/mahjong-soul/honba_bangzi.png',
  riichi: '/mahjong-soul/riichi_bangzi.png',
} as const;

export function BangziCounter({
  count,
  label,
  type,
}: {
  count: number;
  label: string;
  type: keyof typeof bangziImages;
}) {
  return (
    <div className="grid min-w-[78px] justify-items-center gap-0.5">
      <span className="text-[0.58rem] font-semibold tracking-[0.14em] text-[#9ab0c1]">
        {label}
      </span>
      <div className="flex items-center justify-center gap-1 rounded-full bg-[rgba(2,12,20,0.3)] px-2 py-1">
        <BangziImage type={type} />
        <span className="min-w-[22px] text-left text-xs font-bold text-[#f2f7fb]">
          {`x${count}`}
        </span>
      </div>
    </div>
  );
}

export function RemainingTileCount({ count }: { count: number }) {
  return (
    <div className="grid justify-items-center gap-0.5">
      <span className="text-[0.66rem] font-semibold tracking-[0.18em] text-[#9ab0c1]">
        {'\u5269\u4f59\u724c'}
      </span>
      <strong className="text-2xl leading-none text-[#f2f7fb]">
        {count}
        <span className="ml-1 text-sm font-medium text-[#c7d6e2]">
          {'\u5f20'}
        </span>
      </strong>
    </div>
  );
}

function BangziImage({ type }: { type: keyof typeof bangziImages }) {
  return (
    <img
      alt=""
      className="h-[34px] w-auto shrink-0 select-none object-contain"
      draggable={false}
      src={bangziImages[type]}
    />
  );
}
