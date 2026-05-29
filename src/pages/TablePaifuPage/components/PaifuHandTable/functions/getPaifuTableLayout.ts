import type { SeatWind } from '@/objects/tournament';

export const handPositionClasses: Record<SeatWind, string> = {
  East: 'bottom-[20px] left-1/2 w-[min(94%,900px)] -translate-x-1/2 justify-center',
  South:
    'right-[22px] top-1/2 w-[min(70%,560px)] origin-center -translate-y-1/2 translate-x-[42%] rotate-90 justify-center',
  West: 'left-1/2 top-[24px] w-[min(82%,720px)] -translate-x-1/2 justify-center',
  North:
    'left-[22px] top-1/2 w-[min(70%,560px)] origin-center -translate-x-[42%] -translate-y-1/2 -rotate-90 justify-center',
};

export const labelPositionClasses: Record<SeatWind, string> = {
  East: 'bottom-[132px] left-1/2 -translate-x-1/2 text-center',
  South: 'right-[112px] top-1/2 -translate-y-[calc(50%+142px)] text-right',
  West: 'left-1/2 top-[130px] -translate-x-1/2 text-center',
  North: 'left-[112px] top-1/2 -translate-y-[calc(50%+142px)] text-left',
};

export const tileSizeClasses: Record<SeatWind, string> = {
  East: 'w-[clamp(34px,5.1vw,58px)]',
  South: 'w-[clamp(24px,3.2vw,40px)]',
  West: 'w-[clamp(26px,3.4vw,42px)]',
  North: 'w-[clamp(24px,3.2vw,40px)]',
};

export const tileFaceClasses: Record<SeatWind, string> = {
  East: '',
  South: 'rotate-180',
  West: '',
  North: 'rotate-180',
};

export const riverTileFaceClasses: Record<SeatWind, string> = {
  East: '',
  South: 'rotate-180',
  West: 'rotate-180',
  North: 'rotate-180',
};

export const riverPositionClasses: Record<SeatWind, string> = {
  East: 'left-1/2 top-[calc(50%+142px)] -translate-x-1/2',
  South: 'left-[calc(50%+170px)] top-1/2 -translate-y-1/2 rotate-90',
  West: 'left-1/2 top-[calc(50%-218px)] -translate-x-1/2',
  North: 'left-[calc(50%-350px)] top-1/2 -translate-y-1/2 -rotate-90',
};

export const meldPositionClasses: Record<SeatWind, string> = {
  East: 'left-[calc(50%+192px)] top-[calc(50%+198px)] -translate-x-1/2',
  South: 'right-[260px] top-[calc(50%-292px)] -translate-y-1/2 rotate-90',
  West: 'left-[calc(50%+186px)] top-[calc(50%-262px)] -translate-x-1/2 rotate-180',
  North:
    'left-[calc(50%-452px)] top-[calc(50%+120px)] -translate-y-1/2 -rotate-90',
};

export const operationPositionClasses: Record<SeatWind, string> = {
  East: 'left-1/2 top-[calc(50%+116px)] -translate-x-1/2',
  South: 'left-[calc(50%+200px)] top-1/2 -translate-y-1/2 -rotate-90',
  West: 'left-1/2 top-[calc(50%-174px)] -translate-x-1/2',
  North: 'left-[calc(50%-272px)] top-1/2 -translate-y-1/2 rotate-90',
};

export const centerPointPositionClasses: Record<SeatWind, string> = {
  East: 'bottom-3 left-1/2 -translate-x-1/2',
  South: 'right-3 top-1/2 -translate-y-1/2 rotate-90',
  West: 'left-1/2 top-3 -translate-x-1/2',
  North: 'left-3 top-1/2 -translate-y-1/2 -rotate-90',
};

export const riverTileImageWidth = 30;
export const riverTileImageHeight = 48;
export const riverTileTopCrop = 4;
export const riverTileVisibleHeight = riverTileImageHeight - riverTileTopCrop;
export const riverRowSize = riverTileVisibleHeight;

export function getDisplayTiles(seat: SeatWind, tiles: string[]) {
  if (seat === 'South' || seat === 'North') {
    return [...tiles].reverse();
  }

  return tiles;
}
