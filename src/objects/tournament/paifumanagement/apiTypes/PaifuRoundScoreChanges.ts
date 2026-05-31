import type { KyokuDescriptor } from '../KyokuDescriptor';
import type { ScoreChange } from '../ScoreChange';

export interface PaifuRoundScoreChanges {
  descriptor: KyokuDescriptor;
  scoreChanges: ScoreChange[];
}
