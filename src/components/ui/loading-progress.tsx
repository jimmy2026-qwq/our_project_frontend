import type { HTMLAttributes } from 'react';

type LoadingProgressTone = 'default' | 'warm';

export interface LoadingProgressProps extends HTMLAttributes<HTMLDivElement> {
  label?: string;
  message?: string;
  value?: number;
  indeterminate?: boolean;
  tone?: LoadingProgressTone;
}

function clampProgress(value: number) {
  if (Number.isNaN(value)) {
    return 0;
  }

  return Math.max(0, Math.min(100, value));
}

export function LoadingProgress({
  className,
  label = 'Loading',
  message,
  value = 64,
  indeterminate = false,
  tone = 'default',
  ...props
}: LoadingProgressProps) {
  const progress = clampProgress(value);
  const trackTone =
    tone === 'warm'
      ? 'bg-[linear-gradient(90deg,rgba(236,197,122,0.18),rgba(114,216,209,0.16))]'
      : 'bg-[linear-gradient(90deg,rgba(114,216,209,0.16),rgba(255,255,255,0.08))]';
  const barTone =
    tone === 'warm'
      ? 'bg-[linear-gradient(90deg,rgba(236,197,122,0.92),rgba(114,216,209,0.82))]'
      : 'bg-[linear-gradient(90deg,rgba(114,216,209,0.92),rgba(126,162,246,0.86))]';

  return (
    <div className={['grid gap-3', className].filter(Boolean).join(' ')} {...props}>
      <div className="flex items-center justify-between gap-3 text-[0.82rem] uppercase tracking-[0.24em] text-[color:var(--muted)]">
        <span>{label}</span>
        <span>{indeterminate ? '...' : `${progress}%`}</span>
      </div>
      <div
        aria-hidden="true"
        className={[
          'relative h-3 overflow-hidden rounded-full border border-[rgba(255,255,255,0.08)]',
          trackTone,
        ].join(' ')}
      >
        <div
          className={[
            'absolute inset-y-0 left-0 rounded-full shadow-[0_0_24px_rgba(114,216,209,0.28)] transition-[width,transform] duration-500 ease-out',
            indeterminate ? 'w-[42%] animate-[loading-progress_1.35s_ease-in-out_infinite]' : '',
            barTone,
          ].join(' ')}
          style={indeterminate ? undefined : { width: `${progress}%` }}
        />
      </div>
      {message ? <p className="m-0 text-sm text-[color:var(--muted)]">{message}</p> : null}
    </div>
  );
}
