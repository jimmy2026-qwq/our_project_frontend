import { createApiReferenceSection } from './modules/api-reference';
import { createArchitectureSection } from './modules/architecture';
import { createLandingHero } from './modules/hero';
import { initMemberHub } from './modules/member-hub';
import { initPublicHall } from './modules/public-hall';
import { createRoleMatrixSection } from './modules/role-matrix';
import { createWorkbenchSection } from './modules/workbench';

export function createApp() {
  return `
    <div class="shell">
      ${createLandingHero()}
      <main class="shell__content">
        <section id="public-hall-root"></section>
        <section id="member-hub-root"></section>
        ${createArchitectureSection()}
        ${createRoleMatrixSection()}
        ${createWorkbenchSection()}
        ${createApiReferenceSection()}
      </main>
    </div>
  `;
}

export async function mountApp(container: HTMLElement) {
  container.innerHTML = createApp();

  const publicHallRoot = container.querySelector<HTMLElement>('#public-hall-root');

  if (!publicHallRoot) {
    throw new Error('Public hall root was not found.');
  }

  const memberHubRoot = container.querySelector<HTMLElement>('#member-hub-root');

  if (!memberHubRoot) {
    throw new Error('Member hub root was not found.');
  }

  await initPublicHall(publicHallRoot);
  await initMemberHub(memberHubRoot);
}
