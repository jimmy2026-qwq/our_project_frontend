import type { AdvancedStatsBackfillMode } from './Dashboard';
import type {
  DomainEventOutboxStatus,
  EventCascadeStatus,
} from './DomainEventResponses';

export interface DomainEventOutboxQuery {
  operatorId: string;
  asOf?: string;
  status?: DomainEventOutboxStatus;
  eventType?: string;
  aggregateType?: string;
  aggregateId?: string;
  subscriberId?: string;
  partitionKey?: string;
  delivered?: boolean;
  blockedOnly?: boolean;
  limit?: number;
  offset?: number;
}

export interface DomainEventSubscribersQuery {
  operatorId: string;
  asOf?: string;
  subscriberId?: string;
  limit?: number;
  offset?: number;
}

export interface DomainEventSubscriberPartitionsQuery {
  operatorId: string;
  subscriberId: string;
  asOf?: string;
  lagOnly?: boolean;
  blockedOnly?: boolean;
  partitionKey?: string;
  limit?: number;
  offset?: number;
}

export interface EventCascadeRecordsQuery {
  operatorId: string;
  status?: EventCascadeStatus;
  consumer?: string;
  eventType?: string;
  aggregateType?: string;
  aggregateId?: string;
  limit?: number;
  offset?: number;
}

export interface AuditEventQuery {
  operatorId: string;
  aggregateType?: string;
  aggregateId?: string;
  actorId?: string;
  eventType?: string;
  limit?: number;
  offset?: number;
}

export interface AggregateAuditEventQuery {
  operatorId: string;
  aggregateType: string;
  aggregateId: string;
  actorId?: string;
  eventType?: string;
  limit?: number;
  offset?: number;
}

export interface AdvancedStatsRecomputeRequest {
  operatorId: string;
  mode?: AdvancedStatsBackfillMode;
  ownerType?: string;
  ownerId?: string;
  reason?: string;
  limit?: number;
}
