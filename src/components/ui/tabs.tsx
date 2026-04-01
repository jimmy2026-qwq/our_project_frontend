import { createContext, useContext, type HTMLAttributes, type ReactNode } from 'react';

import { cx } from '@/lib/cx';
import { Button } from '@/components/ui/button';

interface TabsContextValue {
  value: string;
  onValueChange?: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

export function Tabs({
  value,
  onValueChange,
  className,
  children,
}: {
  value: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children: ReactNode;
}) {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div data-slot="tabs" className={cx('ui-tabs', className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="tabs-list"
      className={cx(
        'ui-tabs__list inline-flex items-center justify-center rounded-2xl border border-[color:var(--line)]',
        'bg-[rgba(255,255,255,0.03)] p-1 text-[color:var(--muted)]',
        className,
      )}
      role="tablist"
      {...props}
    />
  );
}

export function TabsTrigger({
  value,
  className,
  children,
  ...props
}: HTMLAttributes<HTMLButtonElement> & { value: string }) {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error('TabsTrigger must be used within Tabs.');
  }

  const isActive = context.value === value;

  return (
    <Button
      {...props}
      variant="tab"
      role="tab"
      aria-selected={isActive}
      data-slot="tabs-trigger"
      data-state={isActive ? 'active' : 'inactive'}
      className={cx(
        'ui-tabs__trigger rounded-xl transition',
        isActive && 'ui-tabs__trigger--active bg-[rgba(255,255,255,0.06)] shadow-sm',
        className,
      )}
      onClick={(event) => {
        props.onClick?.(event);
        if (!event.defaultPrevented) {
          context.onValueChange?.(value);
        }
      }}
    >
      {children}
    </Button>
  );
}

export function TabsContent({
  value,
  className,
  forceMount = false,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { value: string; forceMount?: boolean }) {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error('TabsContent must be used within Tabs.');
  }

  const isActive = context.value === value;

  if (!forceMount && !isActive) {
    return null;
  }

  return (
    <div
      data-slot="tabs-content"
      className={cx('ui-tabs__content', className)}
      role="tabpanel"
      hidden={!isActive}
      data-state={isActive ? 'active' : 'inactive'}
      {...props}
    >
      {children}
    </div>
  );
}
