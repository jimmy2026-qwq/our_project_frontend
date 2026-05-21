import { createContext, useContext, type HTMLAttributes, type ReactNode } from 'react';

import { cx } from '@/components/ui/cx';
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
      <div data-slot="tabs" className={cx('grid gap-[14px]', className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="tabs-list"
      className={cx(
        'grid items-center justify-center gap-[14px] rounded-2xl border border-[rgba(176,223,229,0.14)]',
        'bg-[rgba(255,255,255,0.03)] p-1 text-[#9ab0c1]',
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
        'rounded-xl transition',
        isActive &&
          'border-[rgba(236,197,122,0.32)] bg-[radial-gradient(circle_at_top_right,rgba(236,197,122,0.12),transparent_40%),linear-gradient(180deg,rgba(23,42,61,0.96),rgba(9,23,36,0.88))] shadow-sm',
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
      className={cx('grid gap-4', className)}
      role="tabpanel"
      hidden={!isActive}
      data-state={isActive ? 'active' : 'inactive'}
      {...props}
    >
      {children}
    </div>
  );
}
