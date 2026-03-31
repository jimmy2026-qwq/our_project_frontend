import type { ReactNode } from 'react';

export function SourceBadge({
  source,
  warning,
  label,
}: {
  source?: 'api' | 'mock';
  warning?: string;
  label?: string;
}) {
  if (!source) {
    return null;
  }

  return (
    <div className="public-hall__meta">
      <span className={`source-badge source-badge--${source}`}>{label ?? (source === 'api' ? 'API' : 'Mock')}</span>
      {warning ? <p className="public-hall__warning">{warning}</p> : null}
    </div>
  );
}

export function EmptyState({ children, asListItem = false }: { children: ReactNode; asListItem?: boolean }) {
  if (asListItem) {
    return <li className="list-row public-hall__empty">{children}</li>;
  }

  return <p className="public-hall__empty">{children}</p>;
}

export function LoadingCard({ children }: { children: ReactNode }) {
  return <div className="card public-hall__loading">{children}</div>;
}
