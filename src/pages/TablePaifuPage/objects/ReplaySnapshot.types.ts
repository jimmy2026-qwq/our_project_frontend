export type RiverDiscard = {
  sequenceNo: number;
  playerId: string;
  tile: string;
  sideways?: boolean;
};

export type MeldTile = {
  tile: string;
  sideways?: boolean;
  concealed?: boolean;
};

export type MeldGroup = {
  actionType: string;
  tiles: MeldTile[];
};
