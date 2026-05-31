import { APIMessage } from '@/system/api';
import type { Paifu } from '@/objects';

export class TournamentPaifuGetAPI extends APIMessage<Paifu> {
  readonly paifuId: string;

  constructor(paifuId: string) {
    super();
    this.paifuId = paifuId;
  }
}
