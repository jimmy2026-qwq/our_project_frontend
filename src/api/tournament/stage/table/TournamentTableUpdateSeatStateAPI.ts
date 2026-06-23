import { APIMessage } from '@/system/api';
import type { SeatWind, TournamentTableView, UpdateTableSeatStateRequest } from '@/objects';

type UpdateTableSeatStatePayload = UpdateTableSeatStateRequest & {
  seat: SeatWind;
};

export class TournamentTableUpdateSeatStateAPI extends APIMessage<TournamentTableView> {
  readonly tableId: string;
  readonly seat: string;
  readonly request: UpdateTableSeatStateRequest;

  constructor(tableId: string, payload: UpdateTableSeatStatePayload) {
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
