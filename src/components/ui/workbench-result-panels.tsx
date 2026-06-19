import type { ReactNode } from 'react';

import { cx } from '@/components/ui/cx';
import { Alert, AlertDescription, AlertTitle } from './alert';
import { ListRow } from './detail-layout';
import { KeyValueItem, KeyValueList } from './key-value';

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
        'grid gap-1 rounded-[20px] border border-[rgba(176,223,229,0.14)] bg-[rgba(255,255,255,0.03)] p-[16px]',
        '[&_strong]:block',
        muted && 'bg-[rgba(255,255,255,0.02)]',
        className,
      )}
    >
      {headline ? <strong className="block">{headline}</strong> : null}
      <KeyValueList>
        {items.map((item) => (
          <KeyValueItem
            key={String(item.label)}
            label={item.label}
            value={item.value}
          />
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
    <Alert
      className={cx('text-[#c7d6e2]', className)}
      variant="warning"
    >
      <AlertTitle>{title}</AlertTitle>
      {description ? <AlertDescription>{description}</AlertDescription> : null}
      <ul className="m-0 grid list-none gap-0 p-0">
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
