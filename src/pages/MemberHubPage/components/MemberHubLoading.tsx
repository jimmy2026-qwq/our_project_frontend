import { LoadingSection } from '@/components/ui';

export function MemberHubLoading() {
  return (
    <LoadingSection
      eyebrow="Member Hub"
      title="Member Workspace"
      description="Loading operator context, dashboards, and club application inbox data."
    >
      Loading member hub...
    </LoadingSection>
  );
}
