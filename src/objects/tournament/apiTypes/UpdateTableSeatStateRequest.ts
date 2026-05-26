export interface UpdateTableSeatStateRequest {
  operatorId: string;
  ready?: boolean;
  disconnected?: boolean;
  note?: string;
}

