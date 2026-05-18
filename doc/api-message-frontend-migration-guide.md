# API Message 前端迁移指南

## 目标

前端 API 调用逐步从资源路径改成消息路径：

```ts
authLoginApiMessage(input)
```

浏览器实际访问：

```text
/api/authLoginApiMessage
```

不再在前端业务 API 模块里写 `/api/auth/login`、`/api/players/me`、`/api/tournaments/:id` 这类资源路径。路径由 message 名字统一推导，request/response 类型继续放在 `src/objects/<service>`。

## 目标形态

API module 对 feature 暴露领域化函数：

```ts
export async function authLoginApiMessage(input: AuthLoginInput) {
  return callApiMessage<AuthLoginInput, AuthLoginOutput>('authLoginApiMessage', input);
}
```

feature 只调用 API 能力：

```ts
const session = await authApi.authLoginApiMessage({
  username,
  password,
});
```

底层 transport 负责把 message 名字转成路径：

```ts
callApiMessage<Input, Output>('authLoginApiMessage', input)
// POST /api/authLoginApiMessage
```

## 命名规则

- message 名称使用 lowerCamelCase，并以 `ApiMessage` 结尾。
- 前端函数名、message 名称、后端 message 路由名保持一致。
- 名称表达业务动作，不表达 HTTP 动词和资源层级。
- 同一个动作只允许一个 message 名称，不再同时维护 REST 名称和 message 名称。

推荐示例：

```text
authLoginApiMessage
authRegisterApiMessage
authRestoreSessionApiMessage
playerCreateApiMessage
playerGetProfileApiMessage
clubCreateApiMessage
clubListApiMessage
tournamentCreateApiMessage
tournamentGetDetailApiMessage
tableStartApiMessage
appealResolveApiMessage
platformAdminBanPlayerApiMessage
platformAdminGrantSuperAdminApiMessage
```

## 输入输出类型

前端类型仍放在 `src/objects/<service>`，不要回到 `src/api/**/requests` 或 `src/api/**/responses`。

```text
src/objects/auth/requests.ts
src/objects/auth/responses.ts
src/objects/player/requests.ts
src/objects/player/responses.ts
```

路径参数、query 参数、body 参数全部收敛到 input 对象：

```ts
export interface PlayerGetProfileInput {
  playerId: string;
}

export interface ClubListInput {
  keyword?: string;
  limit?: number;
  offset?: number;
}
```

没有输入的接口也使用空对象：

```ts
authLogoutApiMessage({})
```

这样可以让所有 message 都是统一的 `Input -> Output` 模型，后续做契约生成和测试会更简单。

## Transport 设计

在 `src/api/shared/http.ts` 或新的 `src/api/shared/message.ts` 增加统一 helper：

```ts
export type ApiMessageName = `${string}ApiMessage`;

export async function callApiMessage<Input extends object, Output>(
  name: ApiMessageName,
  input: Input,
  options: RequestOptions = {},
) {
  return sendJson<Output>(`/${name}`, 'POST', input, options);
}
```

当前 `API_BASE_URL` 默认是 `/api`，所以 `sendJson('/authLoginApiMessage', ...)` 在浏览器里就是 `/api/authLoginApiMessage`。

为了让“编译通过就基本没问题”落到前后端真实契约上，必须引入 message registry：

```ts
interface ApiMessageRegistry {
  authLoginApiMessage: {
    input: AuthLoginInput;
    output: AuthLoginOutput;
  };
  authRestoreSessionApiMessage: {
    input: AuthRestoreSessionInput;
    output: AuthSessionOutput;
  };
}

export async function callRegisteredApiMessage<Name extends keyof ApiMessageRegistry>(
  name: Name,
  input: ApiMessageRegistry[Name]['input'],
): Promise<ApiMessageRegistry[Name]['output']> {
  return callApiMessage(name, input);
}
```

前端 registry 必须从后端导出的 message registry 生成，或在构建/测试中校验本地 registry 与后端导出清单一致。手写 registry 只允许作为临时开发草稿，不能作为迁移完成或合并验收依据。

最低必做校验：

- message name 必须来自后端导出的 registry。
- 每个 message 的 input/output 类型必须能映射到前端 `src/objects/<service>` 类型。
- 前端构建或测试必须失败于缺失、重名、拼写漂移、input/output 对不上的 message。
- 没有后端 registry 导出或校验结果时，对应服务不能标记为迁移完成。

## API Module 迁移步骤

1. 先为一个服务建立 message 类型。
   - 从 `auth` 开始最合适，因为接口少、闭环短。
   - 把现有 payload/response 命名为 `AuthLoginInput`、`AuthLoginOutput` 这类前端对象类型。

2. 增加 `callApiMessage`。
   - 保留 `request`、`sendJson` 给旧 REST 调用过渡使用。
   - 新增 message API 时不再直接调用 `request('/xxx')` 或 `sendJson('/xxx')`。

3. 逐个替换 `src/api/<service>/*.api.ts`。
   - 旧写法：

     ```ts
     sendJson<AuthSuccessContract>('/auth/login', 'POST', payload)
     ```

   - 新写法：

     ```ts
     callRegisteredApiMessage('authLoginApiMessage', payload)
     ```

4. 保持 feature import 不变。
   - feature 继续从 `@/api/auth`、`@/api/player`、`@/api/club` 引入 API service。
   - 不让 feature 关心 message transport。

5. 每迁完一个服务，删除该服务 API 模块中的 REST 字符串。
   - 用 `rg "\"/" src/api/<service>` 检查。
   - 允许 shared transport 里存在 `/${name}`。

## 推荐迁移顺序

1. `auth`
2. `player`
3. `publicquery`
4. `club`
5. `opsanalytics`
6. `platformadmin`
7. `tournament/appeal`
8. `tournament`
9. `dictionary`

`tournament` 放后面，因为它的路径参数、列表筛选、桌状态流转和阶段操作最多，适合作为模式稳定后的大迁移。

## 验收标准

前端单个服务迁移完成后：

```powershell
npm.cmd run build
npm.cmd run test
npm.cmd run lint
```

结构检查：

```powershell
rg "\"/(auth|players|clubs|public|tournaments|tables|records|paifus|appeals|dashboards|admin)" src/api/<service>
rg "request<|sendJson<" src/api/<service>
```

期望结果：

- API module 不再手写 REST path。
- 业务类型仍从 `src/objects/<service>` 引用。
- feature 不直接 import transport。
- `callRegisteredApiMessage` 的 message name 可以被 TypeScript 检查。
- `ApiMessageRegistry` 来自后端导出，或前端构建/测试会校验它与后端导出清单一致。
- 缺失后端 message、message 名称漂移、input/output 类型不一致时，前端验收必须失败。

## 过渡期规则

- 旧 REST 路由在后端保留到整组服务迁移完成。
- 新前端代码只写 message API，不再新增 REST API。
- 同一接口不在 feature 层同时调用 REST 和 message。
- 若后端暂时没有 message endpoint 或没有导出 registry，前端不要先合并对应迁移；这种情况必须在生成/校验阶段失败，而不是等到运行时 404。
