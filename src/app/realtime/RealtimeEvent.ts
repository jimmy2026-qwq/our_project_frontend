import type { RealtimeAggregateType } from './RealtimeAggregateType';
import type { RealtimeEventType } from './RealtimeEventType';
import type { RealtimeSourceEventType } from './RealtimeSourceEventType';

export interface RealtimeEvent {
  id: string;
  eventType: RealtimeEventType;
  aggregateType: RealtimeAggregateType | string;
  aggregateId: string;
  occurredAt: string;
  sourceEventType: RealtimeSourceEventType;
  actorId?: string | null;
  recipientPlayerId?: string | null;
  title?: string | null;
  body?: string | null;
  severity?: string | null;
  actionUrl?: string | null;
  data?: unknown;
}

export const realtimeBrowserEventName = 'riichinexus:realtime-event';

export type RealtimeBrowserEvent = CustomEvent<RealtimeEvent>;
