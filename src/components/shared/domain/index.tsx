import type { ReactNode } from 'react';

import { DataPanel, ListRow } from '@/components/shared/data-display';
import { EmptyState, SourceBadge } from '@/components/shared/feedback';
import { ControlToolbar, InlineActions } from '@/components/shared/layout';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Fieldset,
  FieldsetBody,
  FieldsetLegend,
  FilterBar,
  InfoCard,
  KeyValueItem,
  KeyValueList,
  StatusPill,
} from '@/components/ui';
import { cx } from '@/lib/cx';

type DataSource = 'api' | 'mock';

export interface DashboardPanelShellProps {
  title: string;
  path: string;
  source?: DataSource;
  warning?: string;
  className?: string;
  children?: ReactNode;
  fallback?: ReactNode;
}

export function DashboardPanelShell({
  title,
  path,
  source,
  warning,
  className,
  children,
  fallback,
}: DashboardPanelShellProps) {
  return (
    <DataPanel title={title} description={path} source={source} warning={warning} className={className}>
      {fallback}
      {children}
    </DataPanel>
  );
}

export function DashboardFallbackNotice({
  title = 'Fallback Placeholder',
  children,
  className,
}: {
  title?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Alert
      className={cx('dashboard-placeholder mt-2 text-[color:var(--muted-strong)]', className)}
      variant="warning"
    >
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
}

export function OpsContextPanel({
  title,
  description,
  action,
  children,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <InfoCard className={className} title={title} description={description} aside={action}>
      <FilterBar>{children}</FilterBar>
    </InfoCard>
  );
}

export function WorkbenchContextPanel({
  title,
  description,
  onReload,
  reloadLabel = 'Reload',
  children,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  onReload: () => void;
  reloadLabel?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <OpsContextPanel
      className={className}
      title={title}
      description={description}
      action={
        <Button variant="outline" onClick={onReload}>
          {reloadLabel}
        </Button>
      }
    >
      <ControlToolbar>{children}</ControlToolbar>
    </OpsContextPanel>
  );
}

export interface ClubApplicationListItem {
  id: string;
  title: ReactNode;
  message: ReactNode;
  submittedAt: ReactNode;
  status: string;
  meta?: ReactNode;
  actions?: ReactNode;
}

function getApplicationStatusTone(status: string) {
  switch (status) {
    case 'Pending':
      return 'warning';
    case 'Approved':
      return 'success';
    case 'Rejected':
    case 'Withdrawn':
      return 'neutral';
    default:
      return 'info';
  }
}

export function ClubApplicationList({
  items,
  emptyText,
}: {
  items: ClubApplicationListItem[];
  emptyText: ReactNode;
}) {
  if (items.length === 0) {
    return <EmptyState asListItem={false}>{emptyText}</EmptyState>;
  }

  return (
    <ul className="list">
      {items.map((item) => (
        <ListRow
          key={item.id}
          main={
            <>
              <strong>{item.title}</strong>
              <span>{item.message}</span>
              <span>{item.submittedAt}</span>
            </>
          }
          aside={
            <>
              <StatusPill tone={getApplicationStatusTone(item.status)}>{item.status}</StatusPill>
              {item.meta ? <span>{item.meta}</span> : null}
              {item.actions ? <InlineActions>{item.actions}</InlineActions> : null}
            </>
          }
        />
      ))}
    </ul>
  );
}

export function WorkbenchGuidePanel({
  title,
  description,
  source,
  warning,
  noteTitle,
  noteBody,
  className,
  children,
}: {
  title: ReactNode;
  description?: ReactNode;
  source?: DataSource;
  warning?: string;
  noteTitle?: ReactNode;
  noteBody?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <InfoCard
      className={cx('shared-workbench-guide', className)}
      title={title}
      description={description}
      aside={<SourceBadge source={source} warning={warning} />}
    >
      {noteTitle || noteBody ? (
        <Fieldset className="shared-workbench-guide__note">
          {noteTitle ? <FieldsetLegend>{noteTitle}</FieldsetLegend> : null}
          {noteBody ? <FieldsetBody>{noteBody}</FieldsetBody> : null}
        </Fieldset>
      ) : null}
      {children}
    </InfoCard>
  );
}

export interface WorkbenchResultField {
  label: ReactNode;
  value: ReactNode;
}

export function WorkbenchResultSummary({
  headline,
  items,
  muted = false,
  className,
}: {
  headline?: ReactNode;
  items: WorkbenchResultField[];
  muted?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cx(
        'shared-workbench-result grid gap-1 rounded-[20px] border border-[color:var(--line)] bg-[rgba(255,255,255,0.03)] p-[16px]',
        muted && 'shared-workbench-result--muted bg-[rgba(255,255,255,0.02)]',
        className,
      )}
    >
      {headline ? <strong className="block">{headline}</strong> : null}
      <KeyValueList className="shared-workbench-result__values">
        {items.map((item) => (
          <KeyValueItem key={String(item.label)} label={item.label} value={item.value} />
        ))}
      </KeyValueList>
    </div>
  );
}

export interface WorkbenchBacklogItem {
  id: string;
  title: ReactNode;
  detail: ReactNode;
}

export function WorkbenchBacklogPanel({
  title,
  description,
  items,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  items: WorkbenchBacklogItem[];
  className?: string;
}) {
  return (
    <Alert className={cx('shared-workbench-backlog', className)} variant="warning">
      <AlertTitle>{title}</AlertTitle>
      {description ? <AlertDescription>{description}</AlertDescription> : null}
      <ul className="list">
        {items.map((item) => (
          <ListRow
            key={item.id}
            main={
              <>
                <strong>{item.title}</strong>
                <span>{item.detail}</span>
              </>
            }
          />
        ))}
      </ul>
    </Alert>
  );
}
