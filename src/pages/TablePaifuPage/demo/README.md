# TablePaifuPage demo 数据说明

这个目录只存放牌谱页的临时 demo 数据和 demo 生成器。

- 这里的数据不是后端返回对象，也不是页面公共类型来源。
- `createDemoTablePaifu` 用于本地或开发环境在没有真实牌谱记录时展示牌谱页。
- `createDemoTablePaifuForTable` 用于从真实 table seat 映射出临时 demo 牌谱，辅助当前手动上传和联调流程。
- demo 原始数据里可以保留便于书写的牌张输入，例如 `0p`。进入 `createDemoPaifuRound` 后会统一转换成正式的 `PaifuTile` 结构。
- 后端稳定返回真实牌谱后，应删除本目录以及相关 fallback/demo 调用。
