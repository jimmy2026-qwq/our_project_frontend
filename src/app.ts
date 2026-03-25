import { createApiReferenceSection } from './modules/api-reference';
import { createArchitectureSection } from './modules/architecture';
import { createLandingHero } from './modules/hero';
import { createRoleMatrixSection } from './modules/role-matrix';
import { createWorkbenchSection } from './modules/workbench';

export function createApp() {
  return `
    <div class="shell">
      ${createLandingHero()}
      <main class="shell__content">
        ${createArchitectureSection()}
        ${createRoleMatrixSection()}
        ${createWorkbenchSection()}
        ${createApiReferenceSection()}
      </main>
    </div>
  `;
}

