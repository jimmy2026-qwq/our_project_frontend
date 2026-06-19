import type { Yaku } from '@/objects';

export function getFirstYakumanYaku(yaku: Yaku[]) {
  return yaku.find((item) => item.han >= 13);
}
