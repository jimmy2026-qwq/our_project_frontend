import { getMahjongYakuLabel } from '@/objects';
import type { CSSProperties } from 'react';

import { TileImage } from '../TileViews';
import type { YakumanTileBurstView } from './PaifuOverlays.types';

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
          key={`${tile}-${index}`}
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

      <style>{`
        .yakuman-burst-backdrop {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 50%, rgba(255, 236, 166, 0.32), rgba(230, 75, 30, 0.16) 32%, rgba(0, 0, 0, 0.76) 72%);
          animation: yakuman-burst-backdrop 4.2s cubic-bezier(0.2, 0.8, 0.2, 1) both;
          transform-origin: center;
        }

        .yakuman-burst-center {
          position: absolute;
          left: 50%;
          top: 50%;
          height: 360px;
          width: 360px;
          transform: translate(-50%, -50%);
        }

        .yakuman-burst-glow {
          height: 100%;
          width: 100%;
          border: 1px solid rgba(255, 216, 120, 0.24);
          border-radius: 9999px;
          background: radial-gradient(circle, rgba(255, 216, 120, 0.22), rgba(186, 44, 28, 0.12) 48%, transparent 70%);
          box-shadow: 0 0 86px rgba(255, 178, 82, 0.35), inset 0 0 64px rgba(255, 236, 166, 0.14);
          animation: yakuman-burst-glow 4.2s cubic-bezier(0.2, 0.8, 0.2, 1) both;
          transform-origin: center;
        }

        .yakuman-burst-tile-anchor {
          position: absolute;
          left: 50%;
          top: 50%;
          display: block;
          width: 58px;
        }

        .yakuman-burst-tile {
          display: block;
          animation: yakuman-burst-tile 4.02s cubic-bezier(0.16, 0.8, 0.22, 1) var(--burst-delay) both;
          transform-origin: center;
        }

        .yakuman-burst-title-anchor {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          z-index: 40;
        }

        .yakuman-burst-title {
          display: grid;
          justify-items: center;
          gap: 0.75rem;
          text-align: center;
          animation: yakuman-burst-title 4.2s cubic-bezier(0.2, 0.8, 0.2, 1) both;
        }

        @keyframes yakuman-burst-backdrop {
          0% {
            opacity: 0;
            transform: scale(0.92);
          }
          14% {
            opacity: 1;
            transform: scale(1);
          }
          76% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(1.08);
          }
        }

        @keyframes yakuman-burst-glow {
          0% {
            opacity: 0;
            transform: scale(0.88);
          }
          14% {
            opacity: 1;
            transform: scale(1);
          }
          76% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(1.16);
          }
        }

        @keyframes yakuman-burst-title {
          0% {
            opacity: 0;
            transform: scale(0.72) translateY(18px);
            filter: blur(5px);
          }
          14% {
            opacity: 1;
            transform: scale(1.08) translateY(0);
            filter: blur(0);
          }
          58% {
            opacity: 1;
            transform: scale(1) translateY(0);
            filter: blur(0);
          }
          76% {
            opacity: 1;
            transform: scale(1) translateY(0);
            filter: blur(0);
          }
          100% {
            opacity: 0;
            transform: scale(1.72) translateY(-18px);
            filter: blur(2px);
          }
        }

        @keyframes yakuman-burst-tile {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.42) rotate(0deg);
            filter: brightness(1.18) drop-shadow(0 0 0 rgba(255, 216, 120, 0));
          }

          15% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.18) rotate(0deg);
            filter: brightness(1.22) drop-shadow(0 0 12px rgba(255, 216, 120, 0.48));
          }

          68% {
            opacity: 1;
            transform:
              translate(calc(-50% + var(--burst-x)), calc(-50% + var(--burst-y)))
              scale(1)
              rotate(var(--burst-rotate));
            filter: brightness(1.16) drop-shadow(0 16px 22px rgba(0, 0, 0, 0.38));
          }

          76% {
            opacity: 1;
            transform:
              translate(calc(-50% + var(--burst-x)), calc(-50% + var(--burst-y)))
              scale(1)
              rotate(var(--burst-rotate));
            filter: brightness(1.16) drop-shadow(0 16px 22px rgba(0, 0, 0, 0.38));
          }

          100% {
            opacity: 0;
            transform:
              translate(calc(-50% + var(--burst-x)), calc(-50% + var(--burst-y)))
              scale(0.92)
              rotate(var(--burst-rotate));
            filter: brightness(0.92) drop-shadow(0 18px 28px rgba(0, 0, 0, 0.42));
          }
        }
      `}</style>
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
