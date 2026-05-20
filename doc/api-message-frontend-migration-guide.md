# API Class 前端迁移指南

## 目标

前端 API 调用从 REST path 和函数式 message 改成 API class：

```ts
sendAPI(new LoginAuthAPI(username, password))
```

浏览器实际访问：

```text
/api/loginauthapi
```

路径由前端 API class 名推导，不再在业务 API 模块里写 `/api/auth/login`、`/api/players/me`、`/api/tournaments/:id`，也不再维护 `authLoginApiMessage` 这类字符串 message name。

## 目标形态

每个 API 单独一个文件、一个 class：

```ts
// src/apis/auth/LoginAuthAPI.ts
import { APIMessage } from '@/system/api/APIMessage';
import type { AuthResponse } from '@/objects/auth/responses';

export class LoginAuthAPI extends APIMessage<AuthResponse> {
  readonly username: string;
  readonly password: string;

  constructor(username: string, password: string) {
    super();
    this.username = username;
    this.password = password;
  }
}
```

feature 直接构造 API class 并交给统一 transport：

```ts
import { sendAPI } from '@/system/api/sendAPI';
import { LoginAuthAPI } from '@/apis/auth/LoginAuthAPI';

const session = await sendAPI(new LoginAuthAPI(username, password));
```

后端对应类：

```scala
final case class LoginAuthAPIMessage(...) extends APIMessage[AuthResponse]
```

前后端类共享同一个 API 概念：

```text
frontend: LoginAuthAPI
backend:  LoginAuthAPIMessage
path:     /api/loginauthapi
```

服务级 `src/apis/<service>` 必须保持样板形态：

- 目录下只放 `XxxAPI.ts` 文件。
- 不放 `index.ts`、transport、request/response 类型、API registry 或聚合 service 文件。
- 每个文件只导出同名 API class，不做 barrel export。
- request/response/API contract 类型继续放在 `src/objects/<service>`；后续统一迁移时可以收敛到 `src/objects/<service>/apiTypes`，但不能回到 `src/apis/<service>`。

## 命名规则

- 前端 API class 使用 PascalCase，并以 `API` 结尾，例如 `LoginAuthAPI`。
- 后端 API class 使用同一业务名，并以 `APIMessage` 结尾，例如 `LoginAuthAPIMessage`。
- 路径由前端 class 名 lower-case 得到：`LoginAuthAPI` -> `/api/loginauthapi`。
- 后端注册时从 `LoginAuthAPIMessage` 去掉 `APIMessage` 后缀，再补 `API` 并 lower-case，必须得到同一路径名。
- 名称表达业务动作，不表达 HTTP 动词和 REST 资源层级。

推荐示例：

```text
LoginAuthAPI / LoginAuthAPIMessage
RegisterAuthAPI / RegisterAuthAPIMessage
RestoreAuthSessionAPI / RestoreAuthSessionAPIMessage
CreatePlayerAPI / CreatePlayerAPIMessage
GetPlayerProfileAPI / GetPlayerProfileAPIMessage
CreateClubAPI / CreateClubAPIMessage
ListClubsAPI / ListClubsAPIMessage
CreateTournamentAPI / CreateTournamentAPIMessage
GetTournamentDetailAPI / GetTournamentDetailAPIMessage
StartTableAPI / StartTableAPIMessage
ResolveAppealAPI / ResolveAppealAPIMessage
BanPlayerPlatformAdminAPI / BanPlayerPlatformAdminAPIMessage
GrantSuperAdminPlatformAdminAPI / GrantSuperAdminPlatformAdminAPIMessage
```

## 输入输出类型

类型位置先不迁移，继续和当前后端/前端版本对齐：前端 input/output 类型仍放在 `src/objects/<service>`，不要回到 `src/apis/**/requests` 或 `src/apis/**/responses`。

```text
src/objects/auth/requests.ts
src/objects/auth/responses.ts
src/objects/player/requests.ts
src/objects/player/responses.ts
```

API class 的 constructor 字段就是请求输入。路径参数、query 参数、body 参数全部收敛为 class 字段：

```ts
export class GetPlayerProfileAPI extends APIMessage<PlayerProfileOutput> {
  constructor(readonly playerId: string) {
    super();
  }
}

export class ListClubsAPI extends APIMessage<ClubListOutput> {
  constructor(
    readonly keyword: string = '',
    readonly limit?: number,
    readonly offset?: number,
  ) {
    super();
  }
}
```

没有输入的接口使用无字段 class：

```ts
export class LogoutAuthAPI extends APIWithTokenMessage<LogoutOutput> {}
```

## Transport 设计

在 `src/system/api` 建立统一 API class transport：

```ts
export abstract class APIMessage<Response> {
  declare readonly responseType: Response;

  get needsUserToken() {
    return false;
  }
}

export abstract class APIWithTokenMessage<Response> extends APIMessage<Response> {
  override get needsUserToken() {
    return true;
  }
}

export function apiNameOf(message: APIMessage<unknown>) {
  return message.constructor.name.toLowerCase();
}

export async function sendAPI<Response>(message: APIMessage<Response>) {
  const body = message.needsUserToken ? withUserToken(message) : message;
  return apiRequest<Response>(`/api/${apiNameOf(message)}`, body);
}
```

`sendAPI(new LoginAuthAPI(...))` 必须只依赖 class 名推导路径，业务 API 文件不得手写 path。

## 迁移步骤

1. 先为一个服务确认 API class 清单和 input/output 类型。
   - 从 `auth` 开始最合适，因为接口少、闭环短。
   - 类型仍复用 `src/objects/auth` 里的 request/response/domain 类型。

2. 增加 `APIMessage`、`APIWithTokenMessage`、`sendAPI`、`apiNameOf`。
   - 保留旧 `request`、`sendJson` 给 REST 调用过渡使用。
   - 新 API class 不直接调用 `request('/xxx')` 或 `sendJson('/xxx')`。

3. 为每个 API 建立独立文件。
   - 文件名和 class 名保持一致，例如：

     ```text
     src/apis/auth/LoginAuthAPI.ts
     src/apis/auth/RegisterAuthAPI.ts
     src/apis/auth/RestoreAuthSessionAPI.ts
     ```

   - 每个文件只导出一个同名 API class。
   - `src/apis/<service>/index.ts` 不再保留；调用方直接从 `@/apis/<service>/XxxAPI` 引入。

4. 逐个替换旧 REST 调用。
   - 旧写法：

     ```ts
     sendJson<AuthSuccessContract>('/auth/login', 'POST', payload)
     ```

   - 新写法：

     ```ts
     sendAPI(new LoginAuthAPI(username, password))
     ```

5. 调整 feature import。
   - feature 从 `@/apis/auth/LoginAuthAPI` 引入具体 API class。
   - feature 不通过 `authApi.login(...)` 这类 API service 聚合对象调用。
   - feature 不关心 path、method、JSON transport。

6. 每迁完一个服务，删除该服务 API class 文件中的 REST 字符串。
   - 用 `rg "\"/" src/apis/<service>` 检查。
   - 允许 `src/system/api` transport 里存在 `/api/${apiNameOf(message)}`。
   - 旧的 `*.api.ts` 聚合文件和 `src/apis/<service>/index.ts` 只能在过渡期保留；迁移完成后应删除。

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
rg "\"/(auth|players|clubs|public|tournaments|tables|records|paifus|appeals|dashboards|admin)" src/apis/<service>
rg "request<|sendJson<|callApiMessage|ApiMessageRegistry|xxxApiMessage" src/apis/<service>
```

期望结果：

- 每个 API 单独一个 class 文件，文件名、class 名、后端 `*APIMessage` 名保持一一对应。
- `src/apis/<service>` 目录下只包含 `XxxAPI.ts`，没有 `index.ts`、transport、类型文件或聚合 service 文件。
- API class 文件不手写 REST path。
- 业务类型仍从 `src/objects/<service>` 引用。
- feature 不直接 import transport 以外的低层 HTTP helper。
- feature 不再通过 API service 聚合对象调用 API。
- `sendAPI(new XxxAPI(...))` 的返回类型由 `XxxAPI extends APIMessage<Response>` 决定。
- 前后端 class 命名不一致、字段不一致时，构建/测试或联调必须失败。

## 过渡期规则

- 旧 REST 路由在后端保留到整组服务迁移完成。
- 新前端代码只写 API class，不再新增 REST API 或 `xxxApiMessage` 函数。
- 同一接口不在 feature 层同时调用 REST 和 API class。
- 迁移后的 API 不再把实现放在旧的 `*.api.ts` service 聚合文件中；`src/apis/<service>/index.ts` 这类 re-export 文件也应在模块完成迁移后删除。
- 若后端暂时没有对应 `XxxAPIMessage` 或没有在后端 API 列表注册，前端不要先合并对应迁移，否则运行时会出现不支持的 API。
