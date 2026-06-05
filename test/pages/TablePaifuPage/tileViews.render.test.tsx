import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import {
  HandBackTile,
  ResultBackTile,
  ResultTile,
} from '@/pages/TablePaifuPage/components/PaifuHandTable/components/TileViews';

describe('TileViews rendering', () => {
  it('renders real tile images with useful alt text', () => {
    const markup = renderToStaticMarkup(<ResultTile tile="0m" />);

    expect(markup).toContain('alt="0m"');
    expect(markup).toContain('/mahjong-soul/tiles/individual/0m.png');
    expect(markup).toContain('select-none');
  });

  it('renders stable back tiles for hidden hands and indicators', () => {
    const handBack = renderToStaticMarkup(<HandBackTile seat="East" />);
    const resultBack = renderToStaticMarkup(<ResultBackTile />);

    expect(handBack).toContain('aspect-[80/129]');
    expect(handBack).toContain('bg-[linear-gradient(135deg,#163e72,#275a9c_48%,#7fb2dc)]');
    expect(resultBack).toContain('aspect-[80/129]');
    expect(resultBack).toContain('w-[28px]');
  });
});
