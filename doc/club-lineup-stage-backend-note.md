# 俱乐部提交参赛名单阶段问题说明

## 问题现象

赛事刚创建并邀请俱乐部后，俱乐部管理员进入“拉人参赛/提交名单”弹窗时，前端提示：

- 比赛尚未开放可提交名单的阶段

因此俱乐部无法提交参赛名单。

## 原因结论

这不是前端“误要求选择阶段”。

当前前端提交名单使用的接口是：

- `POST /tournaments/:tournamentId/stages/:stageId/lineups`

也就是说，前端提交名单时必须拿到一个可用的 `stageId`。

如果后端在赛事刚创建后，不能从下面任一接口返回阶段列表，前端就只能认为“当前没有可提交名单的阶段”：

- `GET /tournaments/:tournamentId`
- `GET /tournaments/:tournamentId/stages`
- `GET /public/tournaments/:tournamentId`

## 后端最小改法

建议优先保证下面两件事：

1. 赛事创建成功后，立刻能查到该赛事的阶段列表
2. 受邀俱乐部在提交名单前，能查到至少一个可提交的阶段

最小可行方案是：

- `POST /tournaments` 创建赛事时，后端已经创建的首个阶段，需要能立即被后续查询接口读到
- `GET /tournaments/:tournamentId` 返回的 `stages` 不能为空
- 如果暂时做不到在详情接口返回完整阶段，也至少保证 `GET /tournaments/:tournamentId/stages` 能返回阶段目录

## 前端当前最关心的字段

### 1. `GET /tournaments/:tournamentId`

至少需要：

```json
{
  "tournamentId": "t-001",
  "name": "Spring Open",
  "status": "RegistrationOpen",
  "startsAt": "2026-04-19T10:00:00Z",
  "endsAt": "2026-04-19T18:00:00Z",
  "stages": [
    {
      "stageId": "stage-001",
      "name": "Swiss Stage 1",
      "status": "Pending",
      "roundCount": 4,
      "pendingTablePlanCount": 0,
      "scheduledTableCount": 0,
      "lineupSubmissions": []
    }
  ]
}
```

前端这里最关键的是：

- `stages` 有值
- 每个阶段有 `stageId`
- 每个阶段有 `name`

### 2. `GET /tournaments/:tournamentId/stages`

如果详情接口暂时不稳定，阶段目录接口至少需要：

```json
[
  {
    "stageId": "stage-001",
    "name": "Swiss Stage 1",
    "format": "Swiss",
    "order": 1,
    "status": "Pending",
    "currentRound": 0,
    "roundCount": 4,
    "schedulingPoolSize": 4,
    "pendingTablePlanCount": 0,
    "scheduledTableCount": 0
  }
]
```

这里前端最关键的是：

- `stageId`
- `name`

其余字段没有也不至于阻塞名单提交，但建议保留。

## 提交名单时后端应接受的路径

当前前端会按下面的路径提交：

- `POST /tournaments/:tournamentId/stages/:stageId/lineups`

因此后端不应要求前端“只传 tournamentId 不传 stageId”。

## 推荐后端处理顺序

1. 修正赛事创建后的持久化或读取逻辑，确保首个阶段已真正创建并可查询
2. 保证 `GET /tournaments/:tournamentId` 中 `stages` 立即可见
3. 如果角色权限导致俱乐部侧拿不到详情，也至少开放 `GET /tournaments/:tournamentId/stages`
4. 确认受邀俱乐部在邀请后、未排期前，也能看到当前可提交名单的阶段

## 验收标准

满足以下任一条，前端就不会再因为“没有阶段”而拦住俱乐部提交名单：

- 打开俱乐部提交名单弹窗时，能从 `GET /tournaments/:tournamentId` 读到 `stages[0].stageId`
- 或者能从 `GET /tournaments/:tournamentId/stages` 读到至少一个阶段

## 一句话结论

后端需要保证：赛事创建后，阶段不是只存在于创建命令里，而是要立刻能被查询接口读出来，且至少返回一个可提交名单的 `stageId`。
