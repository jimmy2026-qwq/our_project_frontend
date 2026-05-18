import type { ReactNode } from 'react';

import { cx } from '@/lib/cx';
import { Card, CardContent, CardHeader } from './card';
import { EmptyState, SourceBadge } from './feedback';
import { PanelHead } from './layout';
import { Table, TableBody, TableHead, TableHeader, TableRow } from './table';

type DataSource = 'api' | 'mock';

export function DataPanel({
  title,
  description,
  children,
  source,
  warning,
  badgeLabel,
  className,
}: {
  title: string;
  description?: ReactNode;
  children: ReactNode;
  source?: DataSource;
  warning?: string;
  badgeLabel?: string;
  className?: string;
}) {
  return (
    <Card className={cx('panel-card', className)}>
      <CardHeader className="panel-card__header pb-0">
        <PanelHead
          title={title}
          description={description}
          aside={
            <SourceBadge source={source} warning={warning} label={badgeLabel} />
          }
        />
      </CardHeader>
      <CardContent className="panel-card__content pt-4">{children}</CardContent>
    </Card>
  );
}

export function DataTablePanel({
  title,
  description,
  source,
  warning,
  headers,
  rows,
  emptyText,
  className,
}: {
  title: string;
  description?: ReactNode;
  source?: DataSource;
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
      source={source}
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
