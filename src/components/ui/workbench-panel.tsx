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

export interface DashboardPanelShellProps {
  title: string;
  path: string;
  warning?: string;
  className?: string;
  children?: ReactNode;
  fallback?: ReactNode;
}

/** 工作台数据面板的统一外壳，负责标题、接口路径和数据来源提示。 */
export function DashboardPanelShell({
  title,
  path,
  warning,
  className,
  children,
  fallback,
}: DashboardPanelShellProps) {
  return (
    <DataPanel
      title={title}
      description={path}
      warning={warning}
      className={className}
    >
      {fallback}
      {children}
    </DataPanel>
  );
}

/** 后台接口缺失或使用占位数据时展示的警告说明。 */
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

/** 运营上下文区域，通常包裹筛选条件和当前操作对象说明。 */
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

/** 带重新加载按钮的工作台上下文筛选面板。 */
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

/** 工作台说明面板，支持补充警告提示区。 */
export function WorkbenchGuidePanel({
  title,
  description,
  warning,
  noteTitle,
  noteBody,
  className,
  children,
}: {
  title: ReactNode;
  description?: ReactNode;
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
      aside={<SourceBadge warning={warning} />}
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
