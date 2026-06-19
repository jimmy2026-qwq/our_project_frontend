# app/auth

这个目录负责前端运行时的认证会话。

它和 `src/objects/auth` 是刻意分开的：`src/objects/auth` 只描述后端 API 的请求、响应和后端返回值；这里的 session 是 React 应用在拿到后端认证响应后，为前端页面、全局 provider 和 UI 使用而映射出来的运行态结构。

相比 `sample/frontend-sample2`，当前项目多保留了一层应用级 auth，是因为多个全局能力需要在页面动作之外读取当前会话：

- 路由守卫需要 `isReady` 和当前 session
- realtime provider 需要当前操作者身份
- notifications 需要当前操作者 id
- 页面刷新后需要恢复已持久化的登录或游客 session
- 其它浏览器标签页需要通过 `storage` 事件同步 session 变化

`AuthProvider.tsx` 只负责挂载 React context provider。provider value 由 `useAuthSessionProviderValue.ts` 创建，里面处理持久化 session 的恢复和跨标签页同步。

登录、注册、超管初始化、游客进入和退出登录由各自页面 hook 处理。页面 hook 直接调用具体 API message，然后通过 `useAuthContext` 保存或清空前端 session。
