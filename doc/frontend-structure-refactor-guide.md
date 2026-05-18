# 前端结构重构指南

## 目标

前端这次不做“组件共享平台化”，而是按后端微服务边界重新整理 `src`。

目标如下：

- `src/api` 按微服务拆文件夹
- 新建 `src/objects` 存放跨层业务类型和 API contract 类型，也按微服务拆文件夹
- 整体结构尽量和后端的 `microservices/*` 对齐
- 删除 `src/components/shared`
- 只保留 `src/components/ui` 作为全局 UI 基础层
- 业务组件不复用，按功能就地放到各自 feature 下
- feature 私有的组件 props、局部 state、纯页面展示类型可以继续留在 feature 内

## 目标目录

```text
src/
  api/
    auth/
    player/
    publicquery/
    club/
    tournament/
      appeal/
    opsanalytics/
    dictionary/
    platformadmin/
    shared/
  objects/
    auth/
    player/
    publicquery/
    club/
    tournament/
      appeal/
    opsanalytics/
    dictionary/
    platformadmin/
    shared/
  app/
  components/
    ui/
  config/
  features/
  hooks/
  lib/
  pages/
  providers/
  styles/
  main.tsx
  router.tsx
  index.css
  vite-env.d.ts
```

## `src/api` 的拆法

`src/api` 不再继续用当前这种大量扁平文件：

- `auth.authn.ts`
- `public.tournaments.ts`
- `clubs.members.ts`
- `tables.ts`
- `operations.ts`

而是改成按微服务建文件夹。

每个微服务目录只保留接口调用和接口调用所需的运行时代码：

- `*.api.ts`
- `transport.ts`
- `mappers.ts`
- `index.ts`

`src/api` 不再承载对外导出的 TypeScript 业务类型。请求 payload、响应 contract、filter、跨功能 view model、form model 等类型统一放到 `src/objects`。API 文件内部可以保留不导出的局部辅助类型，但不能作为业务类型出口。

注意：后端每个微服务里会有 `api/requests`、`api/responses`，那是后端 API 层 DTO 的代码组织方式。前端只做概念对齐，不照搬路径；前端的 request/response 类型仍然归入 `objects/<service>`。

示例：

```text
src/api/auth/
  authn.api.ts
  sessions.api.ts
  guest-sessions.api.ts
  demo.api.ts
  transport.ts
  index.ts

src/api/player/
  players.api.ts
  mappers.ts
  transport.ts
  index.ts

src/api/publicquery/
  schedules.api.ts
  tournaments.api.ts
  clubs.api.ts
  leaderboards.api.ts
  dashboards.api.ts
  mappers.ts
  transport.ts
  index.ts

src/api/club/
  core.api.ts
  members.api.ts
  applications.api.ts
  tournaments.api.ts
  mappers.ts
  transport.ts
  index.ts

src/api/tournament/
  tournaments.api.ts
  stages.api.ts
  tables.api.ts
  records.api.ts
  settlements.api.ts
  mappers.ts
  transport.ts
  index.ts

src/api/tournament/appeal/
  appeals.api.ts
  transport.ts
  index.ts

src/api/opsanalytics/
  advanced-stats.api.ts
  domain-events.api.ts
  performance.api.ts
  mappers.ts
  transport.ts
  index.ts

src/api/dictionary/
  entries.api.ts
  namespaces.api.ts
  mappers.ts
  transport.ts
  index.ts

src/api/platformadmin/
  club-governance.api.ts
  platform-roles.api.ts
  player-moderation.api.ts
  mappers.ts
  transport.ts
  index.ts
```

说明：

- `*.api.ts`
  放真正的 API 调用逻辑，按功能拆多个文件
- `transport.ts`
  放后端 wire format 编码/解码、backend option 处理、请求 body 构造等运行时代码
- `mappers.ts`
  放后端 contract 到前端对象的转换逻辑
- `index.ts`
  只做该微服务 API 能力的聚合导出

这里不建议再做一个巨大的 `auth.ts`、`public.ts`、`clubs.ts` 聚合总文件承载全部逻辑。

`src/api/shared/` 只保留真正全局的基础设施：

- `client.ts`
- `http.ts`
- backend option 编码/解码这类通用 transport

## `src/objects` 的拆法

当前项目已经建立了 `src/objects` 目录，后续重点是把剩余 API contract 类型迁入这里，并清理空占位文件。目标形态如下：

```text
src/objects/
  auth/
    index.ts
    requests.ts
    responses.ts
  player/
    index.ts
    requests.ts
    responses.ts
  publicquery/
    index.ts
    dashboard.ts
    requests.ts
    responses.ts
  club/
    index.ts
    requests.ts
    responses.ts
  tournament/
    index.ts
    requests.ts
    responses.ts
    filters.ts
    appeal/
      index.ts
      requests.ts
      responses.ts
      filters.ts
  opsanalytics/
    index.ts
    requests.ts
    responses.ts
  dictionary/
    index.ts
    requests.ts
    responses.ts
  platformadmin/
    index.ts
    requests.ts
    responses.ts
  shared/
    index.ts
    common.ts
```

这个目录统一放跨层业务类型和 API contract 类型，不再把这些类型散落在：

- `src/domain`
- `src/api/contracts`
- 各种 `*.shared.ts`

注意：`features/*/*.types.ts` 并不需要一律迁出。只服务单个 feature 或单个组件的 props、workbench state、展示状态类型可以留在 feature 内；只有跨 feature、跨页面、跨 API 层复用的业务类型才迁入 `objects`。

推荐分工：

- `objects/<service>/`
  放这个微服务相关的请求类型、响应类型、filters、跨功能 view model、form model
- `objects/<service>/requests.ts`
  放前端调用该服务时需要的 request payload / query 类型，对齐后端 request DTO 的概念
- `objects/<service>/responses.ts`
  放后端返回的 response contract 类型，以及必要的前端响应对象类型
- `objects/<service>/filters.ts`
  放列表查询、搜索、筛选条件类型；如果类型很少，也可以合并到 `index.ts`
- `objects/shared/`
  放真正跨服务共享的基础类型，例如分页、通用 option、通用 notice

说明：

- 现在的 `src/domain` 可以逐步迁入 `src/objects`
- 现在的 `src/api/contracts`、`src/api/**/requests`、`src/api/**/responses` 可以逐步迁入 `src/objects/<service>`
- 现在 `*.api.ts` 中导出的 filter/payload 类型也应迁入 `src/objects/<service>`

## 现有目录的取舍

### 应该保留

- `src/app`
  放应用外壳、根级布局
- `src/components/ui`
  放全局 UI primitive 和 theme 相关基础组件
- `src/config`
  放角色、路由开关、环境配置
- `src/features`
  放页面级业务功能实现
- `src/hooks`
  只放真正全局复用 hook
- `src/lib`
  放框架级小工具，不放业务模型
- `src/pages`
  放 route-level 页面入口
- `src/providers`
  放全局 provider
- `src/styles`
  放全局样式和页面级样式

### 应该删除或并入别处

- `src/components/shared`
  **删除**
- `src/domain`
  逐步并入 `src/objects`
- `src/api/contracts`
  逐步并入各微服务 `src/objects/<service>`
- `src/modules`
  大概率不需要，内容并到 `features` 或 `config`

## `components/shared` 的处理原则

本项目要求：

- 不应该复用业务组件
- 只有 `src/components/ui` 下的全局 UI 设置和 primitive 可以共享
- 没有业务语义的纯展示壳、布局 primitive、基础反馈组件可以评估后进入 `src/components/ui`

因此：

- 删除 `src/components/shared`
- 原来放在 `shared/auth`、`shared/data-display`、`shared/domain`、`shared/feedback`、`shared/forms`、`shared/layout` 的组件
  逐步下沉到各自功能目录

例如：

- `RequireAuth.tsx`
  移到 `src/app/guards/` 或 `src/providers/auth/`
- `shared/forms/*`
  如果只服务于某个功能，就搬进该 `feature`
- `shared/data-display/*`
  如果是业务展示壳，不再全局共享，按页面或 feature 拆开
- `shared/domain/*`
  一律下沉到对应 feature
- 多个 feature 中完全复制的纯展示组件，先判断是否带业务语义；如果没有业务语义，优先沉淀为 `components/ui`，不要为了“业务组件不复用”而复制基础 UI。

只保留：

- `src/components/ui/*`

## 目录对齐原则

前端按后端服务名对齐：

- 后端 `auth` 对应前端 `api/auth`、`objects/auth`
- 后端 `player` 对应前端 `api/player`、`objects/player`
- 后端 `publicquery` 对应前端 `api/publicquery`、`objects/publicquery`
- 后端 `club` 对应前端 `api/club`、`objects/club`
- 后端 `tournament` 对应前端 `api/tournament`、`objects/tournament`
- 后端 `tournament/appeal` 对应前端 `api/tournament/appeal`、`objects/tournament/appeal`
- 后端 `opsanalytics` 对应前端 `api/opsanalytics`、`objects/opsanalytics`
- 后端 `dictionary` 对应前端 `api/dictionary`、`objects/dictionary`
- 后端 `platformadmin` 对应前端 `api/platformadmin`、`objects/platformadmin`

页面和 feature 不必强行一比一，但 API 和类型层尽量对齐服务边界。

## 建议迁移顺序

1. 重新盘点当前剩余迁移项
   用 `rg "export (interface|type|enum)" src/api src/objects src/features src/pages` 找出仍在导出的类型，再用 `rg "@/api/.*/(requests|responses)|from './requests|from './responses"` 找出 feature 或 API index 对旧 request/response contract 的依赖。产出一份按服务分组的剩余清单。
2. 先收紧 `src/api` 的类型出口
   把 `src/api/**/requests`、`src/api/**/responses`、以及 `*.api.ts` 里导出的 filter/payload/contract 类型迁到 `src/objects/<service>`。request/response 类型可以保留概念命名，但目标路径应是 `objects/<service>/requests.ts`、`objects/<service>/responses.ts`。
3. 切断 feature 对 API contract 的直接依赖
   feature 不直接 import `@/api/**/responses` 或 `@/api/**/requests`；需要后端 contract 时，应通过 mapper 转成 `objects` 中的前端业务对象，或者把 contract 类型迁入 `objects/<service>/responses.ts` 后从 `objects` 引用。
4. 更新 import
   业务代码统一从 `@/objects` 或 `@/objects/<service>` 引类型，从 `@/api/<service>` 引接口调用函数。API service 的 `index.ts` 只导出接口能力，不再 re-export 业务类型。
5. 再处理 feature 内部类型
   只服务单个 feature 或单个组件的 props、workbench state、展示状态类型可以留在 feature；跨 feature、跨页面、跨 API 层复用的类型迁到 `objects`。
6. 处理重复展示组件
   对完全复制的 `presentation.tsx` 一类文件先判断是否带业务语义。没有业务语义的基础展示壳可以沉淀到 `components/ui`；带业务语义的组件继续就地保留。
7. 清理占位和旧目录
   删除已经搬空的 `src/api/**/requests`、`src/api/**/responses`、`src/api/contracts`、`src/domain`，以及只剩 `export {};` 且没有计划承载类型的空 `objects` 文件。不要删除已经迁到 `src/objects/**/requests.ts`、`src/objects/**/responses.ts` 的类型文件。
8. 验证
   跑 `npm run build` 和已有测试，重点检查 type-only import、循环依赖、API mapper 的 contract 类型引用是否正确。

## 当前项目的具体建议

当前代码已经完成了大部分扁平 API 文件到服务目录的迁移，下一阶段建议聚焦剩余收口：

- `src/api/auth/requests`、`src/api/auth/responses`
  迁入 `src/objects/auth/requests.ts`、`src/objects/auth/responses.ts`，并停止从 `api/auth/index.ts` re-export 类型。
- `src/api/player/requests`、`src/api/player/responses`
  迁入 `src/objects/player/requests.ts`、`src/objects/player/responses.ts`，补齐当前为空的 `objects/player/index.ts`。
- `src/api/publicquery/requests`、`src/api/publicquery/responses`
  迁入 `src/objects/publicquery/requests.ts`、`src/objects/publicquery/responses.ts`，feature 只从 `objects/publicquery` 引类型。
- `src/api/club/requests`、`src/api/club/responses`
  迁入 `src/objects/club/requests.ts`、`src/objects/club/responses.ts`，保留 `api/club` 只做调用、transport、mapper。
- `src/api/tournament/responses` 和 `src/api/tournament/*.api.ts` 导出的 filter/payload
  迁入 `src/objects/tournament/requests.ts`、`src/objects/tournament/responses.ts`、`src/objects/tournament/filters.ts`。
- `src/api/tournament/appeal/appeals.api.ts` 中的 filter/payload
  迁入 `src/objects/tournament/appeal/requests.ts`、`src/objects/tournament/appeal/filters.ts`。
- `src/features/public-hall` 中直接引用 `@/api/tournament/responses/tournament.responses` 的地方
  改为引用 `objects` 中的类型，或改用 mapper 后的前端对象类型。

同时：

- `src/api/**/requests`、`src/api/**/responses`、`src/api/contracts`
  逐步迁入 `src/objects/*`，可以落到 `objects/<service>/requests.ts`、`objects/<service>/responses.ts`
- 只剩 `export {};` 的 `api`、`objects` 占位文件
  如果没有近期承载计划，迁移结束后删除；如果会承载类型，补真实导出。
- 空的 `src/modules`
  迁移结束后删除。
- 多个 feature 中完全相同的 `presentation.tsx`
  先评估是否为基础展示层；如果是，提炼到 `components/ui` 或更明确的基础展示组件文件。

## 禁止事项

- 不再新增 `components/shared/*`
- 不再新增扁平 `src/api/*.ts` 业务文件
- 不再新增 `src/api/**/requests`、`src/api/**/responses`；request/response 类型放到 `src/objects/**`
- 不再把某个微服务的全部 API 塞进一个总 `*.ts` 文件
- 不再从 `src/api` 导出业务类型；API 类型统一从 `src/objects` 导出
- 不再把业务类型继续塞进 `src/domain`
- 不再把跨功能的业务展示壳做成全局共享组件
