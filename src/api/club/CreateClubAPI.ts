import { APIMessage } from '@/system/api';
import type { Club, CreateClubRequest } from '@/objects/club';

export class CreateClubAPI extends APIMessage<Club> {
  readonly name: string;
  readonly creatorId: string;

  constructor(payload: CreateClubRequest) {
    super();
    this.name = payload.name;
    this.creatorId = payload.creatorId;
  }
}
