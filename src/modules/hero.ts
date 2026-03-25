export function createLandingHero() {
  return `
    <section class="hero">
      <div class="hero__copy">
        <p class="eyebrow">RiichiNexus Frontend Blueprint</p>
        <h1>把复杂日麻赛事系统拆成前端可持续推进的四层结构</h1>
        <p class="hero__summary">
          你的后端已经把读接口轮廓给出来了，前端现在最重要的不是立刻补完所有页面，
          而是先建立统一的领域模型、权限视图、API 访问层和页面编排方式。
        </p>
      </div>
      <div class="hero__panel">
        <p class="hero__panel-title">建议前端优先级</p>
        <ol class="priority-list">
          <li>先做公共只读区和角色入口，验证接口模型。</li>
          <li>再做赛事运营台和俱乐部工作台，承接写操作。</li>
          <li>最后再补牌谱上传、申诉流和高阶数据看板。</li>
        </ol>
      </div>
    </section>
  `;
}

