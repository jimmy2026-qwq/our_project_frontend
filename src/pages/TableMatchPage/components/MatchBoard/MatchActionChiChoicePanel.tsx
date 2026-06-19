import type { MahjongLegalAction } from '@/objects';
import { TileImage } from '@/pages/TablePaifuPage/components/PaifuHandTable/components/TileViews';

export function ChiChoicePanel({
  actions,
  disabled,
  onSelect,
}: {
  actions: MahjongLegalAction[];
  disabled: boolean;
  onSelect: (action: MahjongLegalAction) => void;
}) {
  return (
    <div className="flex max-w-full items-center justify-center gap-5 overflow-x-auto rounded-[18px] border border-[rgba(236,197,122,0.32)] bg-[rgba(5,12,18,0.92)] px-5 py-4 shadow-[0_18px_48px_rgba(0,0,0,0.42)] backdrop-blur-md">
      {actions.map((action) => {
        const choiceTiles = getChiChoiceTiles(action);

        return (
          <button
            key={`${action.targetSequenceNo ?? 'chi'}-${action.tiles.join('-')}`}
            aria-label={`吃 ${choiceTiles.join(' ')}`}
            className="flex shrink-0 items-end gap-0 rounded-[12px] border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.05)] px-3 py-2 transition duration-150 hover:-translate-y-0.5 hover:border-[rgba(236,197,122,0.55)] hover:bg-[rgba(236,197,122,0.12)] disabled:cursor-not-allowed disabled:opacity-55"
            disabled={disabled}
            onClick={() => onSelect(action)}
            type="button"
          >
            {choiceTiles.map((tile, index) => (
              <TileImage
                key={`${action.targetSequenceNo ?? 'chi'}-${tile}-${index}`}
                className="block w-[42px] select-none"
                tile={tile}
              />
            ))}
          </button>
        );
      })}
    </div>
  );
}

function getChiChoiceTiles(action: MahjongLegalAction) {
  const calledTile = action.tile;

  if (!calledTile) {
    return action.tiles.slice(0, 2);
  }

  let removedCalledTile = false;

  return action.tiles.filter((tile) => {
    if (!removedCalledTile && getTileIndex(tile) === getTileIndex(calledTile)) {
      removedCalledTile = true;
      return false;
    }

    return true;
  });
}

function getTileIndex(tile: string) {
  const value = tile.trim().toLowerCase();
  const rank = value.startsWith('0') ? 5 : Number(value[0]);
  const suit = value[value.length - 1];

  return `${rank}${suit}`;
}
