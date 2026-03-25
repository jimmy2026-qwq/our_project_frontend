import { featureModules } from '../config/modules';

export function createArchitectureSection() {
  const cards = featureModules
    .map(
      (module) => `
        <article class="card module-card">
          <div class="module-card__head">
            <h2>${module.title}</h2>
            <span>${module.primaryRoles.join(' / ')}</span>
          </div>
          <p>${module.summary}</p>
          <p><strong>核心实体</strong> ${module.entities.join(' , ')}</p>
          <p><strong>前端路由</strong> ${module.routes.join(' | ')}</p>
        </article>
      `,
    )
    .join('');

  return `
    <section class="section">
      <div class="section__header">
        <p class="eyebrow">1. Architecture</p>
        <h2>建议的前端分层</h2>
        <p>
          最适合你的不是按接口文件堆页面，而是按业务模块拆分。
          这样后续无论切到 React、Vue，还是继续用原生 TS，都不需要推翻领域设计。
        </p>
      </div>
      <div class="architecture-grid">
        <article class="card stack-card">
          <h3>Domain</h3>
          <p>统一定义角色、赛事状态、列表信封、排行榜项和面板类型，先稳住类型边界。</p>
        </article>
        <article class="card stack-card">
          <h3>API Layer</h3>
          <p>把所有接口路径、查询参数和 operatorId 约束收口到同一层，避免页面散落拼 URL。</p>
        </article>
        <article class="card stack-card">
          <h3>View Modules</h3>
          <p>按 Public Hall、Club Operations、Tournament Operations、Governance 拆页面集合。</p>
        </article>
        <article class="card stack-card">
          <h3>Workflow State</h3>
          <p>等后端写接口稳定后，再补查询缓存、表单状态和事件回流，不要一开始就把状态管理做重。</p>
        </article>
      </div>
      <div class="module-grid">
        ${cards}
      </div>
    </section>
  `;
}
