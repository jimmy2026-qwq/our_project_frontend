import { HomeClubApplicationSection } from '@/features/blueprint/HomeClubApplicationSection';
import {
  BlueprintApiReferenceSection,
  BlueprintArchitectureSection,
  BlueprintHeroSection,
  BlueprintRoleMatrixSection,
  BlueprintWorkbenchSection,
} from '@/features/blueprint/sections';

export function BlueprintHomePage() {
  return (
    <div className="blueprint-home-page">
      <BlueprintHeroSection />
      <HomeClubApplicationSection />
      <BlueprintArchitectureSection />
      <BlueprintRoleMatrixSection />
      <BlueprintWorkbenchSection />
      <BlueprintApiReferenceSection />
    </div>
  );
}
