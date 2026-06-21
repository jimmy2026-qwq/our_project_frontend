import type { ReactNode } from 'react';

import { Button, type ButtonProps } from './button';
import { cx } from '@/components/ui/cx';

/** 页面或面板章节顶部的眉标、标题、说明和操作区。 */
export function SectionIntro({
  eyebrow,
  title,
  description,
  actions,
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cx('flex items-start justify-between gap-4', className)}>
      <div>
        {eyebrow ? (
          <p className="text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-[#ecc57a]">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="my-2 text-[clamp(1.7rem,3vw,2.8rem)] text-[#f2f7fb]">
          {title}
        </h2>
        {description ? (
          <p className="max-w-[72ch] leading-7 text-[#9ab0c1]">
            {description}
          </p>
        ) : null}
      </div>
      {actions}
    </div>
  );
}

/** 管理表单和筛选器使用的双列工具栏布局。 */
export function ControlToolbar({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cx(
        'grid gap-[14px] md:grid-cols-2',
        '[&_label]:grid [&_label]:gap-2',
        className,
      )}
    >
      {children}
    </div>
  );
}

/** 公共大厅筛选控件的弹性排列容器。 */
export function PortalFilters({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cx(
        'flex flex-wrap gap-4',
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

/** 带刷新动作的筛选行。 */
export function FilterActionRow({
  children,
  onRefresh,
  refreshLabel = '刷新',
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

/** 继承统一按钮样式的轻量动作按钮别名。 */
export function ActionButton({
  className,
  variant = 'default',
  size = 'md',
  ...props
}: ButtonProps) {
  return (
    <Button className={className} variant={variant} size={size} {...props} />
  );
}

/** 面板标题、说明和右侧附加内容的统一头部。 */
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
    <div className="flex items-start justify-between gap-4">
      <div>
        <h3 className="mb-[10px] text-[#f2f7fb]">{title}</h3>
        {description ? <p className="leading-7 text-[#9ab0c1]">{description}</p> : null}
      </div>
      {aside}
    </div>
  );
}

/** 紧凑排列多个行内操作按钮。 */
export function InlineActions({ children }: { children: ReactNode }) {
  return <div className="flex gap-2">{children}</div>;
}
