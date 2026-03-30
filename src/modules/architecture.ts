import { featureModules } from '../config/modules';

const foundationLayers = [
  {
    title: 'App Shell',
    body: '入口由 src/app.ts 负责，采用 hash routing，将 blueprint / public / member-hub / tournament-ops 四个顶层区块挂到同一个壳子里。',
  },
  {
    title: 'Page Modules',
    body: '每个业务面由独立模块初始化，当前以 public-hall、member-hub、tournament-ops、guest-application 为主。',
  },
  {
    title: 'API Client',
    body: '共享请求层集中做 URL 构造、fetch 处理和字段归一化，尤其 public payload 的字段映射必须保留。',
  },
  {
    title: 'Mock Fallback',
    body: '页面默认先打后端，失败时回退到 mock 数据，保持页面可继续浏览和测试，这是当前代码非常重要的交付策略。',
  },
];

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
          <p><strong>关键实体</strong> ${module.entities.join(' / ')}</p>
          <p><strong>主要入口</strong> ${module.routes.join(' | ')}</p>
        </article>
      `,
    )
    .join('');

  return `
    <section class="section">
      <div class="section__header">
        <p class="eyebrow">1. Architecture</p>
        <h2>当前前端是怎样分层和落到页面上的</h2>
        <p>
          从 doc/README.md 看，现有代码并不是传统的“单首页 + 单路由”结构，而是一个以模块为中心的工作台型前端。
          首页蓝图的职责，是先把这些模块的边界、入口和依赖关系讲清楚。
        </p>
      </div>
      <div class="architecture-grid">
        ${foundationLayers
          .map(
            (item) => `
              <article class="card stack-card">
                <h3>${item.title}</h3>
                <p>${item.body}</p>
              </article>
            `,
          )
          .join('')}
      </div>
      <div class="module-grid">
        ${cards}
      </div>
    </section>
  `;
}
