import { LoadingProgress } from '@/components/ui';

/** 实时牌桌页加载桌面状态时的进度提示。 */
export function TableMatchLoading() {
  return (
    <section className="grid gap-6">
      <LoadingProgress
        label="正在加载牌桌"
        message="正在获取当前牌桌状态与座位准备情况。"
      />
    </section>
  );
}
