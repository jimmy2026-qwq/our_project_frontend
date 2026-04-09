import { MetadataCard } from '@/components/shared/data-display';
import { SectionIntro } from '@/components/shared/layout';
import { Separator } from '@/components/ui';
import { roleCapabilities } from '@/config/roles';

export function BlueprintRoleMatrixSection() {
  return (
    <section className="section">
      <SectionIntro
        eyebrow="2. Roles & Surfaces"
        title="How the current routes still map to user roles"
        description="The docs and feature modules already imply a clear division of responsibility even though route guards and richer session infrastructure are still evolving."
      />
      <div className="role-grid">
        {roleCapabilities.map((capability) => (
          <MetadataCard
            key={capability.role}
            className="role-card"
            title={capability.role}
            subtitle={capability.landingRoute}
            summary={capability.description}
            details={
              <>
                <Separator />
                <p><strong>Can read</strong> {capability.canRead.join(' / ') || 'None'}</p>
                <p><strong>Can write</strong> {capability.canWrite.join(' / ') || 'None'}</p>
              </>
            }
          />
        ))}
      </div>
    </section>
  );
}
