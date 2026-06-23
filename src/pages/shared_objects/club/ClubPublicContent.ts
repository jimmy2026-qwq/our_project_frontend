import type { ClubApplicationPolicy } from './ClubApplicationPolicy';
import type { ClubHonor } from './ClubHonor';

export interface ClubPublicContent {
  applicationPolicy?: ClubApplicationPolicy;
  featuredPlayers: string[];
  honors?: ClubHonor[];
}
