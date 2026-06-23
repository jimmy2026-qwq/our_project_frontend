import type { PlayerProfile } from '@/pages/shared_objects/player/PlayerProfile';

export interface PlayerContextState {
  player: PlayerProfile | null;
  warning?: string;
}
