import { useEffect } from 'react';

import { preloadMahjongTileImages } from '../functions/getMahjongTileImage';

export function useMahjongTileImagePreload() {
  useEffect(() => {
    void preloadMahjongTileImages();
  }, []);
}
