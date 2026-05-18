# 前端结构重构剩余迁移清单

生成时间：2026-05-18

本清单对应 `frontend-structure-refactor-guide.md` 的第一步：重新盘点当前剩余迁移项。当前 `src/api/<service>` 和 `src/objects/<service>` 的主体目录已经建立，后续重点是收紧 API 类型出口、迁移 request/response contract、切断 feature 对 API contract 的直接依赖。

## 已符合目标的部分

- `src/components/shared` 不存在。
- `src/domain` 不存在。
- `src/api` 已经按服务拆成 `auth`、`player`、`publicquery`、`club`、`tournament`、`tournament/appeal`、`opsanalytics`、`dictionary`、`platformadmin`、`shared`。
- `src/objects` 已经按服务建立同名目录。
- `npm run build` 当前可通过。
- `auth` 的 request/response 类型已经迁入 `src/objects/auth/requests.ts`、`src/objects/auth/responses.ts`，`src/api/auth/index.ts` 不再 re-export 业务类型。
- `player` 的 request/response 类型已经迁入 `src/objects/player/requests.ts`、`src/objects/player/responses.ts`，`src/api/player/index.ts` 不再 re-export 业务类型。
- `club` 的 request/response 类型已经迁入 `src/objects/club/requests.ts`、`src/objects/club/responses.ts`，`src/api/club/index.ts` 不再 re-export 业务类型。
- `publicquery` 的 request/response 类型已经迁入 `src/objects/publicquery/requests.ts`、`src/objects/publicquery/responses.ts`，`src/api/publicquery/index.ts` 不再 re-export 业务类型。
- `club` 中原 `PublicClubRelationContract` 已改名为 `ClubRelationContract`，避免和 `publicquery` contract 在 `@/objects` 根导出中重名。
- `tournament/appeal` 的 filter/request 类型已经迁入 `src/objects/tournament/appeal/filters.ts`、`src/objects/tournament/appeal/requests.ts`，`src/api/tournament/appeal/index.ts` 不再 re-export 业务类型。
- `tournament` 的 filter/request/response 类型已经迁入 `src/objects/tournament/filters.ts`、`src/objects/tournament/requests.ts`、`src/objects/tournament/responses.ts`，`src/api/tournament/index.ts` 不再 re-export 业务类型。
- `opsanalytics` 已承载 dashboard API 和类型，`src/api/publicquery` 不再暴露 dashboard 调用，`src/objects/publicquery` 不再导出 dashboard contract。
- `public-hall` 里直接引用 `@/api/tournament/responses/tournament.responses` 的位置已经改为引用 `@/objects/tournament`。

## 需要迁移的 API 类型

当前核心服务的 API 类型迁移已经完成。剩余迁移项主要是空占位文件、无业务 API 的占位服务目录，以及重复展示组件的后续评估。

## 可以暂时保留在 feature 内的类型

以下类型更像 feature 私有 props、workbench state 或展示状态，不是本轮 API contract 迁移的优先目标：

- `src/features/public-hall/types.ts`
- `src/features/public-hall/components/*.types.ts`
- `src/features/public-hall/ClubTournamentLineupDialog.types.ts` 中除 API contract 引用以外的局部类型
- `src/features/member-hub/data.shared.ts`
- `src/features/member-hub/components.types.ts`
- `src/features/tournament-ops/data.ts`
- `src/features/blueprint/application-data.ts`

如果后续发现其中某些类型跨 feature 复用，再迁入 `objects/<service>`。

## 空占位文件和目录

这些文件当前只有 `export {};`，迁移时应补真实内容或在确认无承载计划后删除：

- `src/objects/dictionary/index.ts`
- `src/api/dictionary/index.ts`

`dictionary` 主入口目前保留占位注释，因为后续可能需要补字典微服务的前端边界；`src/api/**/requests` 和 `src/api/**/responses` 空目录已经清理。

`src/modules` 目录当前存在但没有文件；迁移结束后可以删除。

## 重复展示组件

原先 5 份完全相同的 `presentation.tsx` / `player-dashboard.presentation.tsx` 已拆分进 `src/components/ui` 的功能文件：`data-panel.tsx`、`portal-section.tsx`、`detail-layout.tsx`、`summary-card.tsx`、`workbench-panel.tsx`。feature 和 page 统一从 `@/components/ui` 桶入口引用，不再保留 `presentation.tsx` 大文件。

## 下一步建议

下一步建议继续观察 `dictionary` 的实际承载计划；如果后续确认不会有字典微服务前端边界，可以再删除 `src/api/dictionary/index.ts` 和 `src/objects/dictionary/index.ts`。
