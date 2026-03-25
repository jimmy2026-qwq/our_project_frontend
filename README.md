# RiichiNexus Frontend

当前公开区已经产品化为一个游客门户，包含：

- 公共首页
- 赛事详情页
- 俱乐部详情页

实现说明：

- 项目基于原生 TypeScript + Vite
- 公共区使用 hash 路由
- 列表页优先请求后端接口，失败时回退到本地 mock
- 赛事详情和俱乐部详情目前由 mock 详情资料承接

当前已接入的公开读接口：

- `GET /public/schedules`
- `GET /public/leaderboards/players`
- `GET /clubs`

建议继续向后端补充的公开详情接口：

- `GET /public/tournaments/:id`
- `GET /public/clubs/:id`

有了这两个接口后，当前详情页可以直接切到真实数据源。
