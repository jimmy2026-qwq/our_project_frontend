import type { ReactNode } from 'react';

import { cx } from '@/components/ui/cx';
import { Alert, AlertDescription, AlertTitle } from './alert';
import { Button } from './button';
import { DataPanel } from './data-panel';
import { SourceBadge } from './feedback';
import { Fieldset, FieldsetBody, FieldsetLegend } from './fieldset';
import { FilterBar } from './filter-bar';
import { InfoCard } from './info-card';
import { ControlToolbar } from './layout';

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
    <DataPanel
      title={title}
      description={path}
      source={source}
      warning={warning}
      className={className}
    >
      {fallback}
      {children}
    </DataPanel>
  );
}

export function DashboardFallbackNotice({
  title = '数据占位',
  children,
  className,
}: {
  title?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Alert
      className={cx(
        'mt-2 text-[#c7d6e2]',
        className,
      )}
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
    <InfoCard
      className={className}
      title={title}
      description={description}
      aside={action}
    >
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
      className={className}
      title={title}
      description={description}
      aside={<SourceBadge source={source} warning={warning} />}
    >
      {noteTitle || noteBody ? (
        <Fieldset>
          {noteTitle ? <FieldsetLegend>{noteTitle}</FieldsetLegend> : null}
          {noteBody ? <FieldsetBody>{noteBody}</FieldsetBody> : null}
        </Fieldset>
      ) : null}
      {children}
    </InfoCard>
  );
}

export {
  ClubApplicationList,
  type ClubApplicationListItem,
} from './workbench-club-application-list';
export {
  WorkbenchBacklogPanel,
  WorkbenchResultSummary,
  type WorkbenchBacklogItem,
  type WorkbenchResultField,
} from './workbench-result-panels';
