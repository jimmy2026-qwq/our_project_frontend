import type { SeatWind } from '@/objects/tournament';

import type { WinningCallFlashView } from './PaifuOverlays.types';

const winningCallPositionClasses: Record<SeatWind, string> = {
  East: 'left-1/2 top-[calc(50%+116px)] -translate-x-1/2 -translate-y-1/2',
  South:
    'left-[calc(50%+200px)] top-1/2 -translate-x-1/2 -translate-y-1/2',
  West: 'left-1/2 top-[calc(50%-174px)] -translate-x-1/2 -translate-y-1/2',
  North:
    'left-[calc(50%-272px)] top-1/2 -translate-x-1/2 -translate-y-1/2',
};

export function WinningCallFlash({
  flash,
}: {
  flash?: WinningCallFlashView;
}) {
  if (!flash) {
    return null;
  }

  return (
    <>
      <style>{`
        @keyframes mahjong-winning-call-flash {
          0% {
            opacity: 0.18;
            transform: scale(1.72);
          }

          72% {
            opacity: 0.92;
          }

          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
      <div
        key={flash.key}
        className={[
          'pointer-events-none absolute z-[18] grid h-[118px] w-[118px] place-items-center rounded-full border-[7px] border-[rgba(236,72,80,0.9)] bg-[rgba(184,31,42,0.32)] text-center font-black leading-none text-white shadow-[0_0_44px_rgba(236,72,80,0.5),inset_0_0_18px_rgba(255,255,255,0.15)] [text-shadow:0_3px_12px_rgba(0,0,0,0.62)]',
          flash.label.length > 1 ? 'text-[2.35rem]' : 'text-[3.2rem]',
          winningCallPositionClasses[flash.seat],
        ].join(' ')}
        style={{
          animation: `mahjong-winning-call-flash ${flash.animationMs}ms cubic-bezier(0.2, 0.82, 0.22, 1) forwards`,
        }}
      >
        {flash.label}
      </div>
    </>
  );
}
