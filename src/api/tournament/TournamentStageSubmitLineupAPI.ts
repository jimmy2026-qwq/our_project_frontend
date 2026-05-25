import { APIMessage } from '@/system/api';
import type { SeatWind, SubmitStageLineupRequest, TournamentMutationView } from '@/objects';
import { emptyBackendOption } from '@/system/api/backend-option.transport';
import type { BackendOption } from '@/system/api/backend-option.transport';

export class TournamentStageSubmitLineupAPI extends APIMessage<TournamentMutationView> {
  readonly tournamentId: string;
  readonly stageId: string;
  readonly request: {
    clubId: string;
    operatorId: string;
    seats: Array<{ playerId: string; preferredWind: BackendOption<SeatWind>; reserve: boolean }>;
    note: BackendOption<string>;
  };

  constructor(tournamentId: string, stageId: string, payload: SubmitStageLineupRequest) {
    super();
    this.tournamentId = tournamentId;
    this.stageId = stageId;
    this.request = {
      clubId: payload.clubId,
      operatorId: payload.operatorId,
      seats: payload.seats.map((seat) => ({
        playerId: seat.playerId,
        preferredWind: seat.preferredWind ? [seat.preferredWind] : emptyBackendOption<SeatWind>(),
        reserve: seat.reserve ?? false,
      })),
      note: payload.note ? [payload.note] : emptyBackendOption<string>(),
    };
  }
}
