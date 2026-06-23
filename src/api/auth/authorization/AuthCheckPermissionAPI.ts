import { APIMessage, encodeBackendOption } from '@/system/api';
import type { Permission } from '@/objects/auth';

export interface AuthCheckPermissionAPIRequest {
  operatorId: string;
  permission: Permission;
  clubId?: string;
  tournamentId?: string;
  subjectPlayerId?: string;
}

export class AuthCheckPermissionAPI extends APIMessage<boolean> {
  readonly operatorId: string;
  readonly permission: Permission;
  readonly clubId: string[];
  readonly tournamentId: string[];
  readonly subjectPlayerId: string[];

  constructor(payload: AuthCheckPermissionAPIRequest) {
    super();
    this.operatorId = payload.operatorId;
    this.permission = payload.permission;
    this.clubId = encodeBackendOption(payload.clubId);
    this.tournamentId = encodeBackendOption(payload.tournamentId);
    this.subjectPlayerId = encodeBackendOption(payload.subjectPlayerId);
  }
}
