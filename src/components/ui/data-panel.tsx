import type { ReactNode } from 'react';

import { Card, CardContent, CardHeader } from './card';
import { EmptyState, SourceBadge } from './feedback';
import { PanelHead } from './layout';
import { Table, TableBody, TableHead, TableHeader, TableRow } from './table';

/** 带标题、说明和警告提示的通用数据面板。 */
export function DataPanel({
  title,
  description,
  children,
  warning,
  badgeLabel,
  className,
}: {
  title: string;
  description?: ReactNode;
  children: ReactNode;
  warning?: string;
  badgeLabel?: string;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader className="pb-0">
        <PanelHead
          title={title}
          description={description}
          aside={<SourceBadge warning={warning ?? badgeLabel} />}
        />
      </CardHeader>
      <CardContent className="pt-4">{children}</CardContent>
    </Card>
  );
}

/** 带表头、数据行和空状态的数据表面板。 */
export function DataTablePanel({
  title,
  description,
  warning,
  headers,
  rows,
  emptyText,
  className,
}: {
  title: string;
  description?: ReactNode;
  warning?: string;
  headers: ReactNode[];
  rows: ReactNode[];
  emptyText: ReactNode;
  className?: string;
}) {
  return (
    <DataPanel
      title={title}
      description={description}
      warning={warning}
      className={className}
    >
      {rows.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((header, index) => (
                <TableHead key={index}>{header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>{rows}</TableBody>
        </Table>
      ) : (
        <EmptyState>{emptyText}</EmptyState>
      )}
    </DataPanel>
  );
}
