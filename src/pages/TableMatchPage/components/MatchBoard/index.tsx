import { useMahjongTileImagePreload } from '@/pages/TablePaifuPage/components/PaifuHandTable/components/TileImagePreload';

import { MatchBoardView } from './MatchBoardView';
import { useMatchBoardModel } from './hooks/useMatchBoardModel';
import type { MatchBoardProps } from './objects/MatchBoardProps';

export function MatchBoard(props: MatchBoardProps) {
  useMahjongTileImagePreload();

  const model = useMatchBoardModel(props);

  return <MatchBoardView {...model} />;
}
