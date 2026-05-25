export type DomainEventDeliveryStatus =
  | 'Pending'
  | 'Delivered'
  | 'Failed'
  | 'Quarantined';

export type DomainEventOutboxStatus =
  | 'Pending'
  | 'Processing'
  | 'Completed'
  | 'DeadLetter'
  | 'Quarantined';

export type EventCascadeStatus = 'Pending' | 'Completed';

export type DomainEventSubscriberStatusKind =
  | 'Active'
  | 'Failed';

export interface DomainEventOutboxRecord {
  id: string;
  aggregateType: string;
  aggregateId: string;
  eventType: string;
  payload: Record<string, unknown>;
  occurredAt: string;
  status: DomainEventDeliveryStatus;
  attemptCount: number;
  nextAttemptAt: string | null;
  lastError: string | null;
}

export interface AuditEventEntry {
  id: string;
  aggregateType: string;
  aggregateId: string;
  eventType: string;
  occurredAt: string;
  actorId: string | null;
  details: Record<string, string>;
  note: string | null;
}

export interface DomainEventDeliveryReceipt {
  id: string;
  outboxId: string;
  subscriberId: string;
  deliveredAt: string;
  status: DomainEventDeliveryStatus;
  errorMessage: string | null;
}

export interface DomainEventBusSummary {
  pendingCount: number;
  deliveredCount: number;
  failedCount: number;
  quarantinedCount: number;
}

export interface DomainEventOutboxHistoryView {
  record: DomainEventOutboxRecord;
  auditTrail: AuditEventEntry[];
  deliveryReceipts: DomainEventDeliveryReceipt[];
}

export interface DomainEventOutboxBatchOperationResult {
  requestedCount: number;
  affectedCount: number;
  skippedCount: number;
  affectedIds: string[];
  skippedIds: string[];
}

export interface DomainEventSubscriberStatus {
  subscriberId: string;
  status: DomainEventSubscriberStatusKind;
  lastDeliveredAt: string | null;
  lastError: string | null;
  lagCount: number;
}

export interface DomainEventSubscriberPartitionStatus {
  subscriberId: string;
  partitionKey: string;
  status: DomainEventSubscriberStatusKind;
  cursor: string | null;
  lagCount: number;
  lastDeliveredAt: string | null;
  lastError: string | null;
}

export interface EventCascadeRecord {
  id: string;
  sourceEventId: string;
  aggregateType: string;
  aggregateId: string;
  cascadeType: string;
  status: DomainEventDeliveryStatus;
  occurredAt: string;
  details: Record<string, string>;
}

export type DomainEventBusSummaryResponse = DomainEventBusSummary;
export type DomainEventOutboxRecordResponse = DomainEventOutboxRecord;
export type DomainEventOutboxHistoryResponse = DomainEventOutboxHistoryView;
export type DomainEventBatchOperationResponse =
  DomainEventOutboxBatchOperationResult;
export type DomainEventSubscriberStatusResponse = DomainEventSubscriberStatus;
export type DomainEventSubscriberPartitionStatusResponse =
  DomainEventSubscriberPartitionStatus;
export type EventCascadeRecordResponse = EventCascadeRecord;
