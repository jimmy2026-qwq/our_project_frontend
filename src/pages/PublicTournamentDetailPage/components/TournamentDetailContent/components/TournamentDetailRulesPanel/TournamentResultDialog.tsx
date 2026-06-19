import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogSurface,
  DialogTitle,
  StatusPill,
} from '@/components/ui';

import { useTournamentDetailRulesPanel } from './hooks/useTournamentDetailRulesPanel';

type TournamentResultRow = ReturnType<
  typeof useTournamentDetailRulesPanel
>['playerDisplayRows'][number];

export function TournamentResultDialog({
  open,
  rows,
  currentPlayerId,
  onOpenChange,
}: {
  open: boolean;
  rows: TournamentResultRow[];
  currentPlayerId?: string;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogSurface className="w-[min(520px,calc(100%-40px))] text-[#f2f7fb]">
          <DialogHeader className="border-b border-[rgba(176,223,229,0.14)] px-6 py-5">
            <DialogTitle className="text-[#f2f7fb]">赛事结果</DialogTitle>
          </DialogHeader>
          <DialogBody className="px-6 py-5 text-[#f2f7fb]">
            {rows.length > 0 ? (
              <div className="grid max-h-[24rem] gap-2 overflow-y-auto pr-1 [scrollbar-color:rgba(176,223,229,0.34)_rgba(255,255,255,0.06)] [scrollbar-width:thin]">
                {rows.map((row, index) => (
                  <div
                    key={`${row.playerId}-${index}`}
                    className="grid grid-cols-[minmax(7rem,auto)_minmax(0,1fr)] items-center gap-3 border-b border-[rgba(255,255,255,0.14)] py-3 text-base leading-6"
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <strong
                        className={`rounded-lg border px-2 py-1 ${getPlacementClassName(
                          row.placement,
                        )}`}
                      >
                        {row.placement ? `${row.placement}位` : '--'}
                      </strong>
                      {currentPlayerId && row.playerId === currentPlayerId ? (
                        <StatusPill tone="success" className="px-2 py-0.5">
                          我
                        </StatusPill>
                      ) : null}
                    </span>
                    <span className="min-w-0 truncate text-right text-[#c7d6e2]">
                      {row.name}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="m-0 text-[#9ab0c1]">暂无赛事结果</p>
            )}
          </DialogBody>
          <DialogFooter className="border-t border-[rgba(176,223,229,0.14)] px-6 py-5">
            <Button onClick={() => onOpenChange(false)}>关闭</Button>
          </DialogFooter>
        </DialogSurface>
      </DialogPortal>
    </Dialog>
  );
}

function getPlacementClassName(placement?: number) {
  const classNames: Record<number, string> = {
    1: 'border-[rgba(255,215,0,0.42)] bg-[rgba(255,215,0,0.16)] text-[#ffd700]',
    2: 'border-[rgba(192,192,192,0.42)] bg-[rgba(192,192,192,0.14)] text-[#c0c0c0]',
    3: 'border-[rgba(205,127,50,0.44)] bg-[rgba(205,127,50,0.15)] text-[#cd7f32]',
    4: 'border-[rgba(87,227,141,0.40)] bg-[rgba(87,227,141,0.13)] text-[#57e38d]',
  };
  const defaultClassName =
    'border-[rgba(242,247,251,0.24)] bg-[rgba(242,247,251,0.08)] text-[#f2f7fb]';

  return `whitespace-nowrap font-bold ${
    typeof placement === 'number'
      ? (classNames[placement] ?? defaultClassName)
      : defaultClassName
  }`;
}
