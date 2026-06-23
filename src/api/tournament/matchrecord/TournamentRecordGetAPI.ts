import { APIMessage } from '@/system/api';
import type { TournamentMatchRecordView } from '@/objects';

export class TournamentRecordGetAPI extends APIMessage<TournamentMatchRecordView> {
  readonly recordId: string;

  constructor(recordId: string) {
    super();
    this.recordId = recordId;
  }
}
