export interface RealtimeEvent {
  id: string;
  eventType: string;
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
}

export const realtimeBrowserEventName = 'riichinexus:realtime-event';

export type RealtimeBrowserEvent = CustomEvent<RealtimeEvent>;
