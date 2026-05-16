# 前端结构重构指南

## 目标

前端这次不做“组件共享平台化”，而是按后端微服务边界重新整理 `src`。

目标如下：

- `src/api` 按微服务拆文件夹
- 新建 `src/objects` 存放所有类型，也按微服务拆文件夹
- 整体结构尽量和后端的 `microservices/*` 对齐
- 删除 `src/components/shared`
- 只保留 `src/components/ui` 作为全局 UI 基础层
- 业务组件不复用，按功能就地放到各自 feature 下

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

每个微服务目录里保留：

- `requests/`
- `responses/`

然后把原本可能会塞进一个总 `*.ts` 的 API 能力文件，按功能拆成多个文件，直接放在该微服务目录下。

示例：

```text
src/api/auth/
  requests/
    authn.requests.ts
    sessions.requests.ts
    guest-sessions.requests.ts
  responses/
    authn.responses.ts
    sessions.responses.ts
    guest-sessions.responses.ts
  authn.api.ts
  sessions.api.ts
  guest-sessions.api.ts
  demo.api.ts
  transport.ts
  index.ts

src/api/player/
  requests/
    players.requests.ts
  responses/
    players.responses.ts
  players.api.ts
  transport.ts
  index.ts

src/api/publicquery/
  requests/
    schedules.requests.ts
    leaderboards.requests.ts
  responses/
    schedules.responses.ts
    tournaments.responses.ts
    clubs.responses.ts
    leaderboards.responses.ts
    dashboards.responses.ts
  schedules.api.ts
  tournaments.api.ts
  clubs.api.ts
  leaderboards.api.ts
  dashboards.api.ts
  mappers.ts
  transport.ts
  index.ts

src/api/club/
  requests/
    core.requests.ts
    applications.requests.ts
  responses/
    core.responses.ts
    members.responses.ts
    applications.responses.ts
  core.api.ts
  members.api.ts
  applications.api.ts
  tournaments.api.ts
  transport.ts
  index.ts

src/api/tournament/
  requests/
    tournaments.requests.ts
    stages.requests.ts
    tables.requests.ts
    settlements.requests.ts
  responses/
    tournaments.responses.ts
    stages.responses.ts
    tables.responses.ts
    records.responses.ts
    settlements.responses.ts
  tournaments.api.ts
  stages.api.ts
  tables.api.ts
  records.api.ts
  settlements.api.ts
  transport.ts
  index.ts

src/api/tournament/appeal/
  requests/
    appeals.requests.ts
  responses/
    appeals.responses.ts
  appeals.api.ts
  transport.ts
  index.ts

src/api/opsanalytics/
  requests/
    advanced-stats.requests.ts
    domain-events.requests.ts
  responses/
    advanced-stats.responses.ts
    domain-events.responses.ts
    performance.responses.ts
  advanced-stats.api.ts
  domain-events.api.ts
  performance.api.ts
  index.ts

src/api/dictionary/
  requests/
    entries.requests.ts
    namespaces.requests.ts
  responses/
    entries.responses.ts
    namespaces.responses.ts
  entries.api.ts
  namespaces.api.ts
  transport.ts
  index.ts

src/api/platformadmin/
  requests/
    club-governance.requests.ts
    platform-roles.requests.ts
    player-moderation.requests.ts
  responses/
    club-governance.responses.ts
    platform-roles.responses.ts
    player-moderation.responses.ts
  club-governance.api.ts
  platform-roles.api.ts
  player-moderation.api.ts
  transport.ts
  index.ts
```

说明：

- `requests/`
  放该微服务请求对象，按功能拆文件
- `responses/`
  放该微服务响应对象，按功能拆文件
- `*.api.ts`
  放真正的 API 调用逻辑，但按功能拆多个文件

这里不建议再做一个巨大的 `auth.ts`、`public.ts`、`clubs.ts` 聚合总文件承载全部逻辑。

`src/api/shared/` 只保留真正全局的基础设施：

- `client.ts`
- `http.ts`
- backend option 编码/解码这类通用 transport

## `src/objects` 的拆法

新增：

```text
src/objects/
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
```

这个目录统一放类型，不再把业务类型散落在：

- `src/domain`
- `src/api/contracts`
- `features/*/*.types.ts`
- 各种 `*.shared.ts`

推荐分工：

- `objects/<service>/`
  放这个微服务相关的请求类型、响应类型、view model、filters、form model、page state model
- `objects/shared/`
  放真正跨服务共享的基础类型，例如分页、通用 option、通用 notice

说明：

- 现在的 `src/domain` 可以逐步迁入 `src/objects`
- 现在的 `src/api/contracts` 可以逐步拆进 `src/api/<service>/contracts.ts`

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
  逐步并入各微服务 `src/api/<service>/contracts.ts`
- `src/modules`
  大概率不需要，内容并到 `features` 或 `config`

## `components/shared` 的处理原则

本项目要求：

- 不应该复用业务组件
- 只有 `src/components/ui` 下的全局 UI 设置和 primitive 可以共享

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

1. 新建 `src/objects`
2. 先迁 `src/domain` 中的类型
3. 重组 `src/api` 为按服务分目录
4. 把 `src/api/contracts` 拆进对应服务目录
5. 删除 `src/components/shared`，把里面的业务组件下沉
6. 清理 `src/modules`
7. 最后统一更新 import 路径

## 当前项目的具体建议

基于当前目录，推荐这样处理：

- `src/api/auth.*`
  迁入 `src/api/auth/`
- `src/api/public.*`
  迁入 `src/api/publicquery/`
- `src/api/clubs.*`
  迁入 `src/api/club/`
- `src/api/tournaments.ts`、`src/api/tables.ts`、`src/api/records.ts`
  迁入 `src/api/tournament/`
- `src/api/appeals.ts`
  迁入 `src/api/tournament/appeal/`
- `src/api/auth.players.ts`
  迁入 `src/api/player/`
- `src/api/operations.ts`
  根据实际内容拆到 `opsanalytics`、`platformadmin`、`dictionary`

同时：

- `src/domain/*`
  逐步迁入 `src/objects/*`
- `src/components/shared/*`
  拆散下沉
- `src/modules`
  评估后并入 `features` 或 `config`

## 禁止事项

- 不再新增 `components/shared/*`
- 不再新增扁平 `src/api/*.ts` 业务文件
- 不再把某个微服务的全部 API 塞进一个总 `*.ts` 文件
- 不再把业务类型继续塞进 `src/domain`
- 不再把跨功能的业务展示壳做成全局共享组件
