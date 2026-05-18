import { emptyBackendOption, encodeBackendOption } from '../shared/backend-option.transport';
import type {
  FileAppealPayload,
  StartTablePayload,
  UpdateOwnReadyStatePayload,
  UpdateSeatStatePayload,
} from './tables.api';

export function buildStartTableRequest(payload: StartTablePayload = {}) {
  return {
    operatorId: payload.operatorId ? [payload.operatorId] : emptyBackendOption<string>(),
  };
}

export function buildFileAppealRequest(payload: FileAppealPayload) {
  return {
    playerId: payload.playerId,
    description: payload.description,
    attachments: emptyBackendOption<string>(),
    priority: emptyBackendOption<string>(),
    dueAt: emptyBackendOption<string>(),
  };
}

export function buildUpdateSeatStateRequest(payload: UpdateSeatStatePayload) {
  return {
    operatorId: payload.operatorId,
    ...(payload.ready === undefined ? {} : { ready: encodeBackendOption(payload.ready) }),
    ...(payload.disconnected === undefined
      ? {}
      : { disconnected: encodeBackendOption(payload.disconnected) }),
    note: payload.note ? [payload.note] : emptyBackendOption<string>(),
  };
}

export function buildUpdateOwnReadyStateRequest(payload: UpdateOwnReadyStatePayload) {
  return {
    operatorId: payload.operatorId,
    ready: payload.ready ?? true,
    ...(payload.note ? { note: payload.note } : {}),
  };
}
