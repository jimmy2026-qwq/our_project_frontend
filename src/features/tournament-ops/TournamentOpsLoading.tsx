import { LoadingSection } from '@/components/shared/feedback';

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
