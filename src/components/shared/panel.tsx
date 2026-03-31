import type { ReactNode } from 'react';

export function PanelHead({
  title,
  description,
  aside,
}: {
  title: string;
  description?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <div className="public-hall__panel-head">
      <div>
        <h3>{title}</h3>
        {description ? <p>{description}</p> : null}
      </div>
      {aside}
    </div>
  );
}

export function FiltersHead({
  title,
  action,
}: {
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="public-hall__filters-head">
      <h3>{title}</h3>
      {action}
    </div>
  );
}
