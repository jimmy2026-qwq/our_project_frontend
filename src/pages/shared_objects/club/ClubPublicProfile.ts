import type { ClubPublicActivity } from './ClubPublicActivity';
import type { ClubPublicContent } from './ClubPublicContent';
import type { ClubPublicIdentity } from './ClubPublicIdentity';
import type { ClubPublicRelations } from './ClubPublicRelations';
import type { ClubPublicStats } from './ClubPublicStats';

export type ClubPublicProfile = ClubPublicIdentity &
  ClubPublicStats &
  ClubPublicRelations &
  ClubPublicContent &
  ClubPublicActivity;
