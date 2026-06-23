import { APIMessage } from '@/system/api';
import type { ClubView, CreateClubRequest } from '@/objects/club';

export class CreateClubAPI extends APIMessage<ClubView> {
  readonly name: string;
  readonly creatorId: string;

  constructor(payload: CreateClubRequest) {
    super();
    this.name = payload.name;
    this.creatorId = payload.creatorId;
  }
}
