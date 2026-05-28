export function ReplayControls({
  maxReplayStep,
  onBackward,
  onForward,
  replayStep,
}: {
  maxReplayStep: number;
  onBackward: () => void;
  onForward: () => void;
  replayStep: number;
}) {
  return (
    <div className="absolute bottom-[36px] right-[34px] z-[10] grid gap-2">
      <button
        className={[
          'min-h-[38px] rounded-2xl border px-4 py-2 text-sm font-medium transition-[border-color,background-color,color,opacity] duration-200',
          replayStep <= 0
            ? 'cursor-not-allowed border-[rgba(176,223,229,0.08)] bg-[rgba(255,255,255,0.02)] text-[#6f8292] opacity-60'
            : 'border-[rgba(176,223,229,0.18)] bg-[rgba(7,18,28,0.74)] text-[#f2f7fb] hover:border-[rgba(114,216,209,0.36)] hover:bg-[rgba(114,216,209,0.1)]',
        ].join(' ')}
        disabled={replayStep <= 0}
        onClick={onBackward}
        type="button"
      >
        {'回退一步'}
      </button>
      <button
        className={[
          'min-h-[38px] rounded-2xl border px-4 py-2 text-sm font-medium transition-[border-color,background-color,color,opacity] duration-200',
          replayStep >= maxReplayStep
            ? 'cursor-not-allowed border-[rgba(176,223,229,0.08)] bg-[rgba(255,255,255,0.02)] text-[#6f8292] opacity-60'
            : 'border-[rgba(236,197,122,0.38)] bg-[rgba(236,197,122,0.14)] text-[#ffd98a] hover:border-[rgba(236,197,122,0.58)] hover:bg-[rgba(236,197,122,0.2)]',
        ].join(' ')}
        disabled={replayStep >= maxReplayStep}
        onClick={onForward}
        type="button"
      >
        {'向前一步'}
      </button>
    </div>
  );
}
