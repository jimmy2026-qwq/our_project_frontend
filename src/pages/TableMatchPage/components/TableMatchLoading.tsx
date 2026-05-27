import { LoadingProgress } from '@/components/ui';

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
