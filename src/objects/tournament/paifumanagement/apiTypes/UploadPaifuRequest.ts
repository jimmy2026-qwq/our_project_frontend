import type { Paifu } from '../Paifu';

export interface UploadPaifuRequest {
  operatorId?: string;
  paifu: Paifu;
}
