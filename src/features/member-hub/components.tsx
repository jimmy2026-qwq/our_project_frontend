import { LoadingSection } from '@/components/shared/feedback';

export { MemberHubPageSection } from './components.section';

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
