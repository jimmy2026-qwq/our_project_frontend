import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import {
  DoraIndicatorTile,
  HandBackTile,
  HandTile,
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
    const resultBack = renderToStaticMarkup(<ResultBackTile className="w-[40px]" />);

    expect(handBack).toContain('aspect-[80/129]');
    expect(handBack).toContain('bg-[linear-gradient(135deg,#163e72,#275a9c_48%,#7fb2dc)]');
    expect(resultBack).toContain('aspect-[80/129]');
    expect(resultBack).toContain('w-[40px]');
  });

  it('renders hand and dora indicator tiles with stable table classes', () => {
    const handTile = renderToStaticMarkup(
      <HandTile className="selected" seat="South" tile="5p" />,
    );
    const doraTile = renderToStaticMarkup(<DoraIndicatorTile tile="7z" />);

    expect(handTile).toContain('group/tile');
    expect(handTile).toContain('selected');
    expect(handTile).toContain('/mahjong-soul/tiles/individual/5p.png');
    expect(doraTile).toContain('w-[28px]');
    expect(doraTile).toContain('/mahjong-soul/tiles/individual/7z.png');
  });
});
