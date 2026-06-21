import { LoadingSection } from '@/components/ui';

/** 赛事运营页加载期间的进度状态。 */
export function TournamentOpsLoading() {
  return (
    <LoadingSection
      eyebrow="Tournament Ops"
      title="Loading tournament operations"
      description="Preparing tables, records, and appeal workflows."
    >
      Loading tournament operations...
    </LoadingSection>
  );
}
