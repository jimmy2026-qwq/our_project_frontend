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
          <p><strong>读取</strong> ${capability.canRead.join(' / ') || '无'}</p>
          <p><strong>写入</strong> ${capability.canWrite.join(' / ') || '无'}</p>
        </article>
      `,
    )
    .join('');

  return `
    <section class="section">
      <div class="section__header">
        <p class="eyebrow">2. RBAC</p>
        <h2>前端里角色系统怎么落地</h2>
        <p>
          不要只把 RBAC 当路由守卫。更实用的做法是让角色同时决定导航入口、按钮显隐、查询参数和页面布局密度。
        </p>
      </div>
      <div class="role-grid">
        ${cards}
      </div>
    </section>
  `;
}

