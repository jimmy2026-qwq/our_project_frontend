import type { CSSProperties } from 'react';

import type { SeatWind } from '@/objects/tournament/apiTypes';

import {
  tileFaceClasses,
  tileSizeClasses,
} from './paifuTableLayout';

export function TileImage({
  className,
  style,
  tile,
}: {
  className: string;
  style?: CSSProperties;
  tile: string;
}) {
  return (
    <img
      alt={tile}
      className={className}
      draggable={false}
      src={`/mahjong-soul/tiles/individual/${tile}.png`}
      style={style}
    />
  );
}

export function HandTile({ seat, tile }: { seat: SeatWind; tile: string }) {
  return (
    <span
      className={[
        'group/tile relative inline-flex shrink-0',
        'transition-transform duration-150 hover:-translate-y-1',
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
      className={[
        'relative inline-flex shrink-0',
        tileSizeClasses[seat],
      ].join(' ')}
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

export function ResultBackTile({ className = 'w-[28px]' }: { className?: string }) {
  return (
    <span
      className={[
        'block aspect-[80/129] rounded-[4px] border border-[#95b6cf] bg-[linear-gradient(135deg,#163e72,#275a9c_48%,#7fb2dc)] shadow-[inset_0_1px_0_rgba(255,255,255,0.34),inset_0_-4px_0_rgba(7,19,46,0.34)]',
        className,
      ].join(' ')}
    />
  );
}
