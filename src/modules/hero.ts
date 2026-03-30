export function createLandingHero() {
  const highlightCards = [
    {
      label: '当前入口',
      title: '#/',
      detail: '项目蓝图首页，用来串起 README、接口契约和现有前端模块。',
    },
    {
      label: '主文档',
      title: '/doc/README.md',
      detail: '说明现有模块、路由、数据策略与推荐后续工作。',
    },
    {
      label: '接口契约',
      title: '/doc/FRONTEND_INTERFACE_CONTRACTS.md',
      detail: '稳定接口形状，以 public、club application、stage directory 等能力为主。',
    },
    {
      label: '演示接口',
      title: '/doc/DEMO_FRONTEND_API.md',
      detail: '保留 demo summary / widgets 说明，适合后续做概览卡片和演示动作栏。',
    },
  ];

  return `
    <section class="hero blueprint-hero">
      <div class="hero__copy">
        <p class="eyebrow">RiichiNexus Frontend Blueprint</p>
        <h1>把当前代码、接口契约与首页体验重新对齐</h1>
        <p class="hero__summary">
          这版蓝图页聚焦“现在这套前端到底交付了什么”。它把路由入口、主要模块、角色能力、接口落点和 mock fallback
          策略整理成一个可读首页，既能给前端开发看，也能给后端联调和产品评审看。
        </p>
        <div class="blueprint-hero__chips">
          <span class="portal-inline-badge">Hash Routing</span>
          <span class="portal-inline-badge">Typed Client</span>
          <span class="portal-inline-badge">API First</span>
          <span class="portal-inline-badge">Mock Safe Mode</span>
        </div>
      </div>
      <div class="hero__panel blueprint-hero__panel">
        <p class="hero__panel-title">本次首页重建聚焦</p>
        <ol class="priority-list">
          <li>把 #/ 明确成项目蓝图页，而不是零散静态模块堆叠。</li>
          <li>把 README 中的现状说明同步成前端首页里的结构化信息。</li>
          <li>把 /doc 中当前仍在使用的接口路径，直接映射到页面模块与工作流。</li>
        </ol>
      </div>
      <div class="blueprint-highlights">
        ${highlightCards
          .map(
            (item) => `
              <article class="card blueprint-highlight-card">
                <span>${item.label}</span>
                <strong>${item.title}</strong>
                <p>${item.detail}</p>
              </article>
            `,
          )
          .join('')}
      </div>
    </section>
  `;
}
