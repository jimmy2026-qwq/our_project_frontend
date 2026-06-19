import { LoadingProgress } from '@/components/ui';

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
