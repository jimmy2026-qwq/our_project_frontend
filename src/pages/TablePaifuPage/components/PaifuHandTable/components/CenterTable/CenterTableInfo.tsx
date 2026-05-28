import type { PaifuRoundSummary } from '../../../../types';
import {
  getDoraIndicators,
  getRemainingTileCount,
  getRoundTitle,
} from '../../../../objects/replay';
import { DoraIndicatorTile } from '../TileViews';
import { BangziCounter, RemainingTileCount } from './CenterTableCounters';
import type { TableStickDisplay } from './CenterTable.types';

interface CenterTableInfoProps {
  isExhaustiveDrawResult: boolean;
  isRoundPickerOpen: boolean;
  onToggleRoundPicker: () => void;
  replayStep: number;
  round: PaifuRoundSummary;
  tableSticks: TableStickDisplay;
}

export function CenterTableInfo({
  isExhaustiveDrawResult,
  isRoundPickerOpen,
  onToggleRoundPicker,
  replayStep,
  round,
  tableSticks,
}: CenterTableInfoProps) {
  const doraIndicators = getDoraIndicators(round, replayStep);
  const remainingTileCount = getRemainingTileCount(round, replayStep);

  return (
    <div className="relative z-[2] grid justify-items-center gap-3">
      <button
        aria-expanded={isRoundPickerOpen}
        className="rounded-xl px-2 py-1 text-[0.76rem] font-semibold tracking-[0.16em] text-[#ecc57a] transition hover:bg-[rgba(236,197,122,0.12)] hover:text-[#ffd98a]"
        onClick={onToggleRoundPicker}
        type="button"
      >
        {getRoundTitle(round)}
      </button>
      {isExhaustiveDrawResult ? (
        <strong className="py-7 text-3xl font-bold tracking-[0.16em] text-[#d6a2ff] [text-shadow:0_2px_18px_rgba(148,77,255,0.72)]">
          {'\u8352\u724c\u6d41\u5c40'}
        </strong>
      ) : (
        <>
          <DoraAndStickCounters
            doraIndicators={doraIndicators}
            tableSticks={tableSticks}
          />
          <RemainingTileCount count={remainingTileCount} />
        </>
      )}
    </div>
  );
}

function DoraAndStickCounters({
  doraIndicators,
  tableSticks,
}: {
  doraIndicators: string[];
  tableSticks: TableStickDisplay;
}) {
  return (
    <div className="grid justify-items-center gap-1">
      <span className="text-[0.66rem] font-semibold tracking-[0.18em] text-[#9ab0c1]">
        {'\u5b9d\u724c\u6307\u793a\u724c'}
      </span>
      <div className="grid grid-cols-[78px_auto_78px] items-end gap-3">
        <BangziCounter
          count={tableSticks.riichi}
          label={'\u7acb\u76f4'}
          type="riichi"
        />
        <div className="flex h-[45px] min-w-[90px] items-center justify-center gap-0">
          {doraIndicators.length > 0 ? (
            doraIndicators.map((tile, index) => (
              <DoraIndicatorTile key={`${tile}-${index}`} tile={tile} />
            ))
          ) : (
            <span className="grid h-[36px] min-w-[26px] place-items-center rounded bg-[rgba(255,255,255,0.08)] text-xs text-[#9ab0c1]">
              -
            </span>
          )}
        </div>
        <BangziCounter
          count={tableSticks.honba}
          label={'\u672c\u573a'}
          type="honba"
        />
      </div>
    </div>
  );
}
