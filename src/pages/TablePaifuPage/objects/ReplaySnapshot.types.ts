import type { PaifuTile } from '@/objects';

export type RiverDiscard = {
  sequenceNo: number;
  playerId: string;
  tile: PaifuTile;
  sideways?: boolean;
};

export type MeldTile = {
  tile: PaifuTile;
  sideways?: boolean;
  concealed?: boolean;
};

export type MeldGroup = {
  actionType: string;
  tiles: MeldTile[];
};
