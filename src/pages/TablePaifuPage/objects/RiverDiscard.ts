import type { PaifuTile } from '@/objects';

export type RiverDiscard = {
  sequenceNo: number;
  playerId: string;
  tile: PaifuTile;
  sideways?: boolean;
};
