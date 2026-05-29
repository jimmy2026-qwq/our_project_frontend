export type RiverDiscard = {
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
