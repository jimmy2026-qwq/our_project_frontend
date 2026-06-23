import type { ClubSummary } from '@/pages/shared_objects/club/ClubSummary';

import type { PublicSchedule } from '../schedule/PublicSchedule';
import type { LoadState } from './LoadState';

export interface HomeDataState {
  schedules: LoadState<PublicSchedule>;
  clubs: LoadState<ClubSummary>;
}
