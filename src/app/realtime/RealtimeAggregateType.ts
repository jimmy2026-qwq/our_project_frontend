/** Realtime 事件中 aggregateType 字段的前端协议常量。
 *
 * 后端来源是 system/private/AggregateType，不属于公开 objects 镜像，因此这里不放入 objects。
 */
export const RealtimeAggregateTypes = {
  MahjongTable: 'mahjongTable',
} as const;

export type RealtimeAggregateType =
  (typeof RealtimeAggregateTypes)[keyof typeof RealtimeAggregateTypes];
