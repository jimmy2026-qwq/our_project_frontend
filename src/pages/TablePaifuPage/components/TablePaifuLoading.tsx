import { LoadingProgress } from '@/components/ui';

import { TablePaifuBackButton } from './TablePaifuBackButton';

interface TablePaifuLoadingProps {
  onBack: () => void;
}

export function TablePaifuLoading({ onBack }: TablePaifuLoadingProps) {
  return (
    <section className="grid gap-6">
      <TablePaifuBackButton onBack={onBack} />
      <LoadingProgress
        label="Loading paifu"
        message="Fetching the archived match record and round summaries."
      />
    </section>
  );
}
