import type { ReactNode } from 'react';

export function SectionIntro({
  eyebrow,
  title,
  description,
  actions,
  className = 'section__header',
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <div>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
      {actions}
    </div>
  );
}

export function ControlToolbar({
  children,
  className = 'public-hall__toolbar',
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}

export function PortalFilters({
  children,
  className = 'portal-filters',
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}

export function ActionButton({
  children,
  className = 'portal-refresh',
  type = 'button',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={className} {...props}>
      {children}
    </button>
  );
}

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

export function InlineActions({ children }: { children: ReactNode }) {
  return <div className="inline-actions">{children}</div>;
}
