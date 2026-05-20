import { APIMessage } from '@/system/api';
import type { TournamentTableView, UpdateTableSeatStateRequest } from '@/objects';

export class TournamentTableUpdateSeatStateAPI extends APIMessage<TournamentTableView> {
  readonly tableId: string;
  readonly seat: string;
  readonly request: Omit<UpdateTableSeatStateRequest, 'seat'>;

  constructor(tableId: string, payload: UpdateTableSeatStateRequest) {
    super();
    this.tableId = tableId;
    this.seat = payload.seat;
    this.request = {
      operatorId: payload.operatorId,
      ready: payload.ready,
      disconnected: payload.disconnected,
      note: payload.note,
    };
  }
}
