import type { StageLineupSeatRequest } from './StageLineupSeatRequest';

export interface SubmitStageLineupRequest {
  clubId: string;
  operatorId: string;
  seats: StageLineupSeatRequest[];
  note?: string;
}

