# Mahjong Soul Asset Index

This folder contains the frontend-facing Mahjong Soul assets selected for UI revamp work.

Use these short paths in the app instead of importing from deep versioned directories under `game.maj-soul.com`.

## Decorative

- `decorative/background-texture.jpg`
  Use as a low-opacity texture layer behind CSS gradients.

- `decorative/lobby-frame-atlas.png`
  Use for ornamental frames, title bars, section trims, and gold-edged decorative fragments.

- `decorative/match-lobby-atlas.png`
  Use for tab rails, section bars, panel strips, and match-lobby-style trim.

- `decorative/room-atlas.png`
  Use for room-management style frames, filter panel decoration, and component inspiration.

## Tiles

- `tiles/cards.png`
  Use as general mahjong tile decoration in hero areas and empty states.

- `tiles/hand-cards.png`
  Use for stronger hand-based visual decoration in banners and feature cards.

## Reference

- `reference/qh-main-reference.png`
  Full screenshot reference for homepage composition and hierarchy.

- `reference/qh-tournaments-reference.png`
  Full screenshot reference for tournament-page structure and density.

- `reference/match-lobby-actions-reference.png`
  Reference for quick-action cards and tournament entry buttons.

- `reference/lobby-side-rail-reference.png`
  Reference for icon rail treatment and alert badge style.

## Usage Rules

Prefer this order of usage:

1. CSS gradients, color, spacing, and shadows
2. Decorative atlas fragments
3. Tile illustrations
4. Reference screenshots only for comparison

Avoid using the reference screenshots directly in production UI layouts.
