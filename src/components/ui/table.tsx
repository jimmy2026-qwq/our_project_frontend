import type { HTMLAttributes, TableHTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react';

import { cx } from '@/components/ui/cx';

/** 为数据表提供横向滚动容器和统一表格基础样式。 */
export function Table({ className, ...props }: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div data-slot="table-wrap" className="relative w-full overflow-x-auto">
      <table data-slot="table" className={cx('w-full caption-bottom text-sm', className)} {...props} />
    </div>
  );
}

/** 渲染表头区域并统一表头行的底部分隔线。 */
export function TableHeader({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead data-slot="table-header" className={cx('[&_tr]:border-b', className)} {...props} />;
}

/** 渲染表体区域并移除最后一行多余分隔线。 */
export function TableBody({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody data-slot="table-body" className={cx('[&_tr:last-child]:border-0', className)} {...props} />;
}

/** 渲染表格汇总脚注区域。 */
export function TableFooter({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cx('border-t border-[rgba(176,223,229,0.14)] bg-[rgba(255,255,255,0.03)] font-medium [&>tr]:last:border-b-0', className)}
      {...props}
    />
  );
}

/** 渲染带 hover 高亮和分隔线的数据行。 */
export function TableRow({ className, ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return <tr data-slot="table-row" className={cx('border-b border-[rgba(176,223,229,0.14)] transition-colors hover:bg-[rgba(255,255,255,0.03)]', className)} {...props} />;
}

/** 渲染表格列标题单元格。 */
export function TableHead({ className, ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      data-slot="table-head"
      className={cx('h-10 px-2 text-left align-middle font-medium text-[#9ab0c1]', className)}
      {...props}
    />
  );
}

/** 渲染普通表格数据单元格。 */
export function TableCell({ className, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td data-slot="table-cell" className={cx('p-2 align-middle text-[#c7d6e2]', className)} {...props} />;
}

/** 渲染表格底部说明文字。 */
export function TableCaption({ className, ...props }: HTMLAttributes<HTMLTableCaptionElement>) {
  return <caption data-slot="table-caption" className={cx('mt-4 text-sm text-[#9ab0c1]', className)} {...props} />;
}
