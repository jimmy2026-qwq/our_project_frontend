export interface StartTableRequest {
  operatorId?: string;
}

export interface ForceResetTableRequest {
  operatorId: string;
  note: string;
}

export interface UpdateTableSeatStateRequest {
  operatorId: string;
  ready?: boolean;
  disconnected?: boolean;
  note?: string;
}

export interface UpdateOwnTableReadyStateRequest {
  operatorId: string;
  ready?: boolean;
  note?: string;
}

export interface UploadPaifuRequest {
  operatorId?: string;
  paifu: unknown;
}
