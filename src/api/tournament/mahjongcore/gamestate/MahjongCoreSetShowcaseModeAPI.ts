import { APIMessage } from '@/system/api';
import type {
  MahjongCoreShowcaseModeView,
  SetMahjongCoreShowcaseModeRequest,
} from '@/objects';

export class MahjongCoreSetShowcaseModeAPI extends APIMessage<MahjongCoreShowcaseModeView> {
  constructor(readonly request: SetMahjongCoreShowcaseModeRequest) {
    super();
  }
}
