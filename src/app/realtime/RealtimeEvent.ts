import type { RealtimeEventType } from './RealtimeEventType';

export interface RealtimeEvent {
  id: string;
  eventType: RealtimeEventType;
  aggregateType: string;
  aggregateId: string;
  occurredAt: string;
  sourceEventType: string;
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
