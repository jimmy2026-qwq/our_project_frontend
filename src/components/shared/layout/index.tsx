import type { ReactNode } from 'react';

import { Button, type ButtonProps } from '@/components/ui';
import { cx } from '@/lib/cx';

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
    <div className={cx('section__header', className)}>
      <div>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2 className="my-2 text-[clamp(1.7rem,3vw,2.8rem)] text-[color:var(--text)]">{title}</h2>
        {description ? <p className="max-w-[72ch]">{description}</p> : null}
      </div>
      {actions}
    </div>
  );
}

export function ControlToolbar({
  children,
  className = 'shared-control-toolbar',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cx(
        'shared-control-toolbar grid gap-[14px] md:grid-cols-2',
        '[&_label]:grid [&_label]:gap-2',
        '[&_input]:w-full [&_input]:rounded-[14px] [&_input]:border [&_input]:border-[color:var(--line)] [&_input]:bg-[rgba(5,14,23,0.88)] [&_input]:px-[14px] [&_input]:py-[11px] [&_input]:text-[color:var(--text)]',
        '[&_select]:w-full [&_select]:rounded-[14px] [&_select]:border [&_select]:border-[color:var(--line)] [&_select]:bg-[rgba(5,14,23,0.88)] [&_select]:px-[14px] [&_select]:py-[11px] [&_select]:text-[color:var(--text)]',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function PortalFilters({
  children,
  className = 'shared-filter-row',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cx(
        'shared-filter-row flex flex-wrap gap-4',
        '[&_label]:grid [&_label]:min-w-[190px] [&_label]:gap-2',
        '[&_span]:leading-7',
        '[&_select]:rounded-[14px] [&_select]:px-[14px] [&_select]:py-[11px]',
        '[&_input]:rounded-[14px] [&_input]:px-[14px] [&_input]:py-[11px]',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function FilterActionRow({
  children,
  onRefresh,
  refreshLabel = 'Refresh',
  className,
}: {
  children: ReactNode;
  onRefresh: () => void;
  refreshLabel?: ReactNode;
  className?: string;
}) {
  return (
    <PortalFilters className={className}>
      {children}
      <ActionButton onClick={onRefresh}>{refreshLabel}</ActionButton>
    </PortalFilters>
  );
}

export function ActionButton({
  className,
  variant = 'default',
  size = 'md',
  ...props
}: ButtonProps) {
  return (
    <Button className={className ?? 'shared-action-button'} variant={variant} size={size} {...props} />
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
    <div className="shared-panel-head flex items-start justify-between gap-4">
      <div>
        <h3 className="mb-[10px] text-[color:var(--text)]">{title}</h3>
        {description ? <p className="text-[color:var(--muted)] leading-7">{description}</p> : null}
      </div>
      {aside}
    </div>
  );
}

export function InlineActions({ children }: { children: ReactNode }) {
  return <div className="inline-actions flex gap-2">{children}</div>;
}
