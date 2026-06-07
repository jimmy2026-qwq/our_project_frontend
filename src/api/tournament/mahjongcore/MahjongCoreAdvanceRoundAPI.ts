import { APIMessage } from '@/system/api';
import type { BackendOption } from '@/system/api/backend-option.transport';
import type { AdvanceMahjongRoundRequest, MahjongTableView } from '@/objects';

interface AdvanceMahjongRoundTransportRequest {
  playerId: BackendOption<string>;
  showcaseMode: BackendOption<boolean>;
}

export class MahjongCoreAdvanceRoundAPI extends APIMessage<MahjongTableView> {
  readonly request: BackendOption<AdvanceMahjongRoundTransportRequest>;

  constructor(
    readonly tableId: string,
    request?: AdvanceMahjongRoundRequest,
  ) {
    super();
    this.request = request
      ? [
          {
            playerId: encodeNullableBackendOption(request.playerId),
            showcaseMode: encodeNullableBackendOption(request.showcaseMode),
          },
        ]
      : [];
  }
}

function encodeNullableBackendOption<T>(
  value: T | null | undefined,
): BackendOption<T> {
  return value === null || value === undefined ? [] : [value];
}
