import { getMahjongYakuLabel, getPaifuTileCode } from '@/objects';
import type { CSSProperties } from 'react';

import { TileImage } from '../TileViews';
import type { YakumanTileBurstView } from '../../objects/YakumanTileBurstView';
import { YakumanTileBurstStyles } from './YakumanTileBurstStyles';

interface YakumanTileBurstOverlayProps {
  burst?: YakumanTileBurstView;
}

type BurstTileLayout = {
  delay: number;
  rotate: number;
  x: number;
  y: number;
};

const burstTileLayouts: BurstTileLayout[] = [
  { x: -272, y: -158, rotate: -24, delay: 40 },
  { x: -224, y: 64, rotate: 18, delay: 88 },
  { x: -168, y: -214, rotate: 32, delay: 0 },
  { x: -112, y: 158, rotate: -34, delay: 128 },
  { x: -52, y: -120, rotate: 12, delay: 76 },
  { x: 0, y: 220, rotate: 0, delay: 156 },
  { x: 52, y: -210, rotate: -18, delay: 36 },
  { x: 112, y: 138, rotate: 30, delay: 108 },
  { x: 168, y: -112, rotate: -32, delay: 64 },
  { x: 224, y: 74, rotate: 22, delay: 132 },
  { x: 272, y: -168, rotate: 34, delay: 20 },
  { x: -310, y: 4, rotate: -8, delay: 172 },
  { x: 310, y: -4, rotate: 8, delay: 172 },
  { x: 0, y: -270, rotate: 0, delay: 112 },
];

/** 役满和牌时覆盖桌面的牌面爆发动画层。 */
export function YakumanTileBurstOverlay({
  burst,
}: YakumanTileBurstOverlayProps) {
  if (!burst || burst.tiles.length === 0) {
    return null;
  }

  const label = getMahjongYakuLabel(burst.yakuKind);

  return (
    <div className="yakuman-burst-overlay pointer-events-none absolute inset-0 z-[26] overflow-hidden">
      <div className="yakuman-burst-backdrop" />
      <div className="yakuman-burst-center">
        <div className="yakuman-burst-glow" />
      </div>

      {burst.tiles.slice(0, burstTileLayouts.length).map((tile, index) => (
        <span
          className="yakuman-burst-tile-anchor"
          key={`${getPaifuTileCode(tile)}-${index}`}
          style={getTileStyle(burstTileLayouts[index], index)}
        >
          <span className="yakuman-burst-tile">
            <TileImage
              className="block w-full select-none rounded-[6px]"
              tile={tile}
            />
          </span>
        </span>
      ))}

      <div className="yakuman-burst-title-anchor">
        <div className="yakuman-burst-title">
          <span className="rounded-full border border-[rgba(255,216,120,0.54)] bg-[rgba(78,12,12,0.72)] px-5 py-1 text-sm font-black tracking-[0.38em] text-[#ffe39a] shadow-[0_0_28px_rgba(255,178,82,0.34)]">
            役满
          </span>
          <strong className="text-[3.35rem] font-black leading-none text-[#fff4c2] [text-shadow:0_4px_0_rgba(116,28,20,0.86),0_0_34px_rgba(255,205,95,0.78)]">
            {label}
          </strong>
        </div>
      </div>

      <YakumanTileBurstStyles />
    </div>
  );
}

function getTileStyle(
  { delay, rotate, x, y }: BurstTileLayout,
  index: number,
): CSSProperties {
  return {
    '--burst-delay': `${delay}ms`,
    '--burst-rotate': `${rotate}deg`,
    '--burst-x': `${x}px`,
    '--burst-y': `${y}px`,
    zIndex: burstTileLayouts.length - index,
  } as CSSProperties;
}
