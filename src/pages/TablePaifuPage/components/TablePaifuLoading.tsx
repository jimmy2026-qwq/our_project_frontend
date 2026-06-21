import { LoadingProgress } from '@/components/ui';

/** 牌谱页加载期间展示的进度状态。 */
export function TablePaifuLoading() {
  return (
    <div className="grid gap-6">
      <LoadingProgress
        label="Loading paifu"
        message="Fetching the archived match record and round summaries."
      />
    </div>
  );
}
