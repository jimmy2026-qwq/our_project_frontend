import { useEffect, useMemo, useState, type CSSProperties } from 'react';

import type { SeatWind } from '@/objects/tournament';

import {
  tileFaceClasses,
  tileSizeClasses,
} from '../functions/getPaifuTableLayout';
import {
  getTileImageSrc,
  maxTileImageRetryCount,
} from './TileImagePreload';

export function TileImage({
  className,
  style,
  tile,
}: {
  className: string;
  style?: CSSProperties;
  tile: string;
}) {
  const [retryNonce, setRetryNonce] = useState(0);
  const [hasFailed, setHasFailed] = useState(false);
  const src = useMemo(
    () => getTileImageSrc(tile, retryNonce),
    [retryNonce, tile],
  );

  useEffect(() => {
    setRetryNonce(0);
    setHasFailed(false);
  }, [tile]);

  if (hasFailed) {
    return (
      <TileImageFallback className={className} style={style} tile={tile} />
    );
  }

  return (
    <img
      alt={tile}
      className={className}
      draggable={false}
      onError={() => {
        if (retryNonce < maxTileImageRetryCount) {
          setRetryNonce((current) => current + 1);
          return;
        }

        setHasFailed(true);
      }}
      src={src}
      style={style}
    />
  );
}

export function HandTile({
  className = '',
  seat,
  tile,
}: {
  className?: string;
  seat: SeatWind;
  tile: string;
}) {
  return (
    <span
      className={[
        'group/tile relative inline-flex shrink-0',
        'transition-transform duration-150 hover:-translate-y-1',
        className,
        tileSizeClasses[seat],
      ].join(' ')}
    >
      <TileImage
        className={[
          'relative z-[1] block w-full select-none',
          tileFaceClasses[seat],
        ].join(' ')}
        tile={tile}
      />
    </span>
  );
}

export function HandBackTile({ seat }: { seat: SeatWind }) {
  return (
    <span
      className={['relative inline-flex shrink-0', tileSizeClasses[seat]].join(
        ' ',
      )}
    >
      <span className="block aspect-[80/129] w-full rounded-[6px] border border-[#95b6cf] bg-[linear-gradient(135deg,#163e72,#275a9c_48%,#7fb2dc)] shadow-[inset_0_2px_0_rgba(255,255,255,0.38),inset_0_-5px_0_rgba(7,19,46,0.34)]" />
    </span>
  );
}

export function ResultTile({ tile }: { tile: string }) {
  return <TileImage className="block w-[52px] select-none" tile={tile} />;
}

export function DoraIndicatorTile({ tile }: { tile: string }) {
  return <TileImage className="block w-[28px] select-none" tile={tile} />;
}

export function ResultBackTile({
  className = 'w-[28px]',
}: {
  className?: string;
}) {
  return (
    <span
      className={[
        'block aspect-[80/129] rounded-[4px] border border-[#95b6cf] bg-[linear-gradient(135deg,#163e72,#275a9c_48%,#7fb2dc)] shadow-[inset_0_1px_0_rgba(255,255,255,0.34),inset_0_-4px_0_rgba(7,19,46,0.34)]',
        className,
      ].join(' ')}
    />
  );
}

function TileImageFallback({
  className,
  style,
  tile,
}: {
  className: string;
  style?: CSSProperties;
  tile: string;
}) {
  return (
    <span
      aria-label={tile}
      className={[
        'grid aspect-[80/129] place-items-center rounded-[5px] border border-[#d6c59a] bg-[linear-gradient(180deg,#fbf8ef,#e6dbc2)] text-[0.58rem] font-bold leading-none text-[#22313d] shadow-[inset_0_1px_0_rgba(255,255,255,0.7),inset_0_-3px_0_rgba(94,73,38,0.2)]',
        className,
      ].join(' ')}
      style={style}
      title={tile}
    >
      {formatTileFallbackLabel(tile)}
    </span>
  );
}

function formatTileFallbackLabel(tile: string) {
  return tile.trim().toUpperCase();
}
