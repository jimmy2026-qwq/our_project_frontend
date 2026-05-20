import { encodeBackendOption } from '@/system/api/backend-option.transport';
import { APIMessage } from '@/system/api';
import type { Club } from '@/objects/club';

export class AddClubMemberAPI extends APIMessage<Club> {
  readonly operatorId: string[];

  constructor(
    readonly clubId: string,
    readonly playerId: string,
    operatorId?: string,
  ) {
    super();
    this.operatorId = encodeBackendOption(operatorId);
  }
}
