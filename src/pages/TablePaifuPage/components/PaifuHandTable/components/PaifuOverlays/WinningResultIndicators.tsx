import { DoraIndicatorTile, ResultBackTile, ResultTile } from '../TileViews';

interface IndicatorPanelProps {
  label: string;
  shownCount: number;
  tiles?: string[];
  visible?: boolean;
}

export function IndicatorPanel({
  label,
  shownCount,
  tiles,
  visible,
}: IndicatorPanelProps) {
  return (
    <div className="grid min-w-[190px] justify-items-center gap-2 rounded-2xl border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.04)] px-4 py-3">
      <span className="text-xs font-semibold tracking-[0.18em] text-[#9ab0c1]">
        {label}
      </span>
      <div className="flex h-[40px] items-center justify-center gap-0">
        {getIndicatorSlots({ count: shownCount, tiles, visible }).map(
          (tile, index) =>
            tile ? (
              <DoraIndicatorTile
                key={`${label}-${tile}-${index}`}
                tile={tile}
              />
            ) : (
              <ResultBackTile key={`${label}-back-${index}`} />
            ),
        )}
      </div>
    </div>
  );
}

export function WinningTile({ label, tile }: { label: string; tile: string }) {
  return (
    <span className="relative ml-5 inline-flex">
      <ResultTile tile={tile} />
      <span className="absolute bottom-0 right-0 grid h-[26px] min-w-[26px] place-items-center rounded bg-[rgba(0,0,0,0.48)] px-1 text-[0.95rem] font-black leading-none text-[#ff4c4c] [text-shadow:0_1px_6px_rgba(0,0,0,0.86)]">
        {label}
      </span>
    </span>
  );
}

function getIndicatorSlots({
  count,
  tiles,
  visible = true,
}: {
  count: number;
  tiles?: string[];
  visible?: boolean;
}) {
  const visibleCount = visible ? Math.max(0, Math.min(5, count)) : 0;

  return Array.from({ length: 5 }, (_, index) =>
    index < visibleCount ? tiles?.[index] : undefined,
  );
}
