import { APIMessage } from '@/system/api';
import type { SubmitStageLineupRequest, TournamentMutationView } from '@/objects';
import { emptyBackendOption } from '@/system/api/backend-option.transport';

export class TournamentStageSubmitLineupAPI extends APIMessage<TournamentMutationView> {
  readonly tournamentId: string;
  readonly stageId: string;
  readonly request: {
    clubId: string;
    operatorId: string;
    seats: Array<{ playerId: string; preferredWind: string[]; reserve: boolean }>;
    note: string[];
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
        preferredWind: seat.preferredWind ? [seat.preferredWind] : emptyBackendOption<string>(),
        reserve: seat.reserve ?? false,
      })),
      note: payload.note ? [payload.note] : emptyBackendOption<string>(),
    };
  }
}
