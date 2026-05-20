import { APIMessage } from '@/system/api';
import type { TournamentPaifuSummaryView } from '@/objects';

export class TournamentPaifuGetAPI extends APIMessage<TournamentPaifuSummaryView> {
  readonly paifuId: string;

  constructor(paifuId: string) {
    super();
    this.paifuId = paifuId;
  }
}
