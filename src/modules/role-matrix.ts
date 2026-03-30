import { roleCapabilities } from '../config/roles';

export function createRoleMatrixSection() {
  const cards = roleCapabilities
    .map(
      (capability) => `
        <article class="card role-card">
          <div class="role-card__header">
            <h3>${capability.role}</h3>
            <span>${capability.landingRoute}</span>
          </div>
          <p>${capability.description}</p>
          <p><strong>可读</strong> ${capability.canRead.join(' / ') || '无'}</p>
          <p><strong>可写</strong> ${capability.canWrite.join(' / ') || '无'}</p>
        </article>
      `,
    )
    .join('');

  return `
    <section class="section">
      <div class="section__header">
        <p class="eyebrow">2. Roles & Permissions</p>
        <h2>角色能力和入口路由在当前代码里的映射</h2>
        <p>
          README 里虽然没有正式路由守卫系统，但已经形成很清晰的角色分层。首页蓝图把这些能力收敛成阅读版 RBAC，方便继续做会话态和权限扩展。
        </p>
      </div>
      <div class="role-grid">
        ${cards}
      </div>
    </section>
  `;
}
