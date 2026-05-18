import type { ElementType, ReactNode } from 'react';

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ControlToolbar,
  DescriptionItem,
  DescriptionList,
  EmptyState,
  Fieldset,
  FieldsetBody,
  FieldsetLegend,
  FilterBar,
  InfoCard,
  InlineActions,
  KeyValueItem,
  KeyValueList,
  PanelHead,
  Separator,
  SourceBadge,
  StatCard,
  StatGrid,
  StatusPill,
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui';
import { cx } from '@/lib/cx';

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
  source?: 'api' | 'mock';
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
          aside={<SourceBadge source={source} warning={warning} label={badgeLabel} />}
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
  source?: 'api' | 'mock';
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

export function PortalSection({
  eyebrow,
  title,
  description,
  source,
  warning,
  children,
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  description: ReactNode;
  source?: 'api' | 'mock';
  warning?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cx('portal-section rounded-[var(--radius-xl)] bg-[color:var(--bg-elevated)] p-[26px]', className)}>
      <div className="portal-section__ornament" aria-hidden="true" />
      <div className="portal-section__head flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="my-2 text-[clamp(1.7rem,2.8vw,2.7rem)]">{title}</h2>
          <p className="m-0 leading-8">{description}</p>
        </div>
        <SourceBadge source={source} warning={warning} />
      </div>
      {children}
    </section>
  );
}

export function DetailHero({
  eyebrow,
  title,
  tagline,
  summary,
  actions,
  source,
  warning,
}: {
  eyebrow: string;
  title: string;
  tagline?: ReactNode;
  summary: ReactNode;
  actions?: ReactNode;
  source?: 'api' | 'mock';
  warning?: string;
}) {
  return (
    <section
      className={cx(
        'detail-hero grid gap-4 rounded-[var(--radius-xl)] p-[30px]',
        'grid-cols-[minmax(0,1.25fr)_minmax(280px,0.75fr)]',
        'bg-[radial-gradient(circle_at_top_right,rgba(114,216,209,0.1),transparent_30%),linear-gradient(180deg,rgba(17,34,49,0.94),rgba(9,20,30,0.9))]',
      )}
    >
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-[clamp(2.2rem,4vw,4.4rem)]">{title}</h1>
          {actions}
        </div>
        {tagline ? <p className="detail-hero__tagline mb-3 text-[1.04rem] text-[color:var(--gold)]">{tagline}</p> : null}
        <p className="detail-hero__summary max-w-[62ch] leading-8">{summary}</p>
      </div>
      <SourceBadge source={source} warning={warning} />
    </section>
  );
}

export function DetailCard({
  title,
  children,
}: {
  title: ReactNode;
  children: ReactNode;
}) {
  return (
    <Card className="detail-card">
      <CardHeader className="detail-card__header pb-0">
        <CardTitle className="detail-card__title">{title}</CardTitle>
      </CardHeader>
      <CardContent className="detail-card__content pt-4">{children}</CardContent>
    </Card>
  );
}

export function DetailPageShell({
  backLink,
  hero,
  children,
}: {
  backLink: ReactNode;
  hero: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="detail-page grid gap-6">
      {backLink}
      {hero}
      {children}
    </section>
  );
}

export function DirectoryCard({
  className,
  top,
  title,
  subtitle,
  summary,
  meta,
  action,
}: {
  className?: string;
  top?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  summary?: ReactNode;
  meta?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <article className={cx('grid gap-4 rounded-3xl bg-[color:var(--panel)] p-[22px]', className)}>
      {top ? <div className="grid gap-4">{top}</div> : null}
      <h3 className="m-0 text-[color:var(--text)]">{title}</h3>
      {subtitle ? <p className="m-0 leading-8 text-[color:var(--muted-strong)]">{subtitle}</p> : null}
      {summary ? <p className="m-0 leading-8 text-[color:var(--muted-strong)]">{summary}</p> : null}
      {meta}
      {action}
    </article>
  );
}

export function ListRow({
  main,
  aside,
  className,
}: {
  main: ReactNode;
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <li className={cx('list-row grid gap-4 border-t border-[color:var(--line)] pt-4 first:border-t-0 first:pt-0 md:grid-cols-[minmax(0,1fr)_auto] md:items-start', className)}>
      <div>{main}</div>
      {aside ? <div className="grid gap-1">{aside}</div> : null}
    </li>
  );
}

export function MetricGrid({ children }: { children: ReactNode }) {
  return <StatGrid className="metric-grid mt-[18px] grid gap-3 md:grid-cols-3">{children}</StatGrid>;
}

export function MetricCard({
  label,
  value,
  accent,
}: {
  label: ReactNode;
  value: ReactNode;
  accent?: string;
}) {
  return (
    <StatCard className="metric min-h-full" label={label} value={value} accent={accent} />
  );
}

export function DetailList({ children }: { children: ReactNode }) {
  return <DescriptionList className="detail-list m-0 grid gap-3 p-0">{children}</DescriptionList>;
}

export function DetailListItem({
  label,
  value,
}: {
  label: ReactNode;
  value: ReactNode;
}) {
  return (
    <DescriptionItem
      className="detail-list__item [&_.ui-description-item__separator]:mt-2 last:[&_.ui-description-item__separator]:hidden"
      label={label}
      value={value}
    />
  );
}

export function DetailRows({ children }: { children: ReactNode }) {
  return <ul className="detail-rows m-0 grid list-none gap-3 p-0">{children}</ul>;
}

export function DetailRow({
  title,
  detail,
}: {
  title: ReactNode;
  detail: ReactNode;
}) {
  return (
    <li className="grid gap-1 border-t border-[color:var(--line)] pt-3 first:border-t-0 first:pt-0 last:[&_.detail-rows__separator]:hidden">
      <strong className="text-[color:var(--text)]">{title}</strong>
      <span className="text-[color:var(--muted)]">{detail}</span>
      <Separator className="detail-rows__separator mt-2" />
    </li>
  );
}

export function InfoSummaryGrid({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cx('shared-summary-grid grid gap-[18px]', className)}>{children}</div>;
}

export function InfoSummaryCard({
  label,
  title,
  detail,
  titleAs: TitleTag = 'strong',
  detailAs: DetailTag = 'p',
  className,
}: {
  label: ReactNode;
  title: ReactNode;
  detail: ReactNode;
  titleAs?: ElementType;
  detailAs?: ElementType;
  className?: string;
}) {
  return (
    <article className={cx('card shared-summary-card min-h-full', className)}>
      <span className="shared-summary-card__label mb-3 inline-flex w-fit rounded-full border border-[color:var(--line)] bg-[rgba(236,197,122,0.08)] px-[10px] py-[6px] text-[0.8rem] text-[color:var(--gold)]">
        {label}
      </span>
      <TitleTag className="mb-[10px] block text-[color:var(--text)]">{title}</TitleTag>
      <DetailTag>{detail}</DetailTag>
    </article>
  );
}

export function MetadataCard({
  title,
  subtitle,
  summary,
  details,
  className,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  summary?: ReactNode;
  details?: ReactNode;
  className?: string;
}) {
  return (
    <article className={cx('card shared-metadata-card', className)}>
      <div className="shared-metadata-card__head flex items-start justify-between gap-4">
        <h3 className="mb-[10px] text-[color:var(--text)]">{title}</h3>
        {subtitle ? <span className="text-[color:var(--muted)]">{subtitle}</span> : null}
      </div>
      {summary ? <p>{summary}</p> : null}
      {details}
    </article>
  );
}

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
