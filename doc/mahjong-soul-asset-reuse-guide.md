# Mahjong Soul Asset Reuse Guide

## Purpose

This document classifies the Mahjong Soul assets currently stored under `/front/public` and explains which ones are safe and useful to reuse during the UI revamp.

The goal is to avoid turning the new frontend into a screenshot collage.

Use these assets mainly for:

- decorative framing
- atmosphere
- ornament
- hero embellishment
- empty-state illustration

Do not use them as the foundation for core interactive controls unless explicitly noted.

## Main Asset Sources

Top-level local references:

- `/front/public/qh_main.png`
- `/front/public/qh_tounaments_page.png`
- `/front/public/cards.png`
- `/front/public/hand_cards.png`

Imported Mahjong Soul resource tree:

- `/front/public/game.maj-soul.com/1/...`

## Reuse Policy

Split all imported assets into three groups:

1. direct decorative reuse
2. reference only or redraw
3. do not use directly

## Group A: Direct Decorative Reuse

These are the best candidates for immediate reuse in the frontend.

They work well as ornament, panel chrome, trim, or visual garnish.

### 1. Lobby frame atlas

File:

- `/front/public/game.maj-soul.com/1/v0.11.159.w/res/atlas/myres/lobby.png`

Recommended use:

- section title banner
- page frame trim
- bottom decorative strip
- ornamental divider
- panel header skin

Why it is useful:

- contains strong Mahjong Soul visual language
- mostly decorative
- easy to slice into reusable UI fragments

Do not do this:

- do not place the whole image as one giant page block
- do not force business content into the original fixed layout

### 2. Match lobby atlas

File:

- `/front/public/game.maj-soul.com/1/v0.11.217.w/res/atlas/myres/match_lobby.png`

Recommended use:

- tab rails
- section bars
- panel bases
- gold-edged content strips
- data block backgrounds

Why it is useful:

- has strong structural pieces
- suitable for tournament and public-hall areas
- useful as a source for recurring ornamental elements

### 3. Room atlas

File:

- `/front/public/game.maj-soul.com/1/v0.11.131.w/res/atlas/myres/room.png`

Recommended use:

- framed filter area
- settings card shell
- small color-coded chips or segmented control inspiration
- right-side utility icon treatment reference

Why it is useful:

- contains many modular room-management visuals
- useful for operational pages like tournament management

Important note:

Prefer partial extraction only. This file is better for component fragments than whole-screen use.

### 4. Global background texture

File:

- `/front/public/game.maj-soul.com/1/background.jpg`

Recommended use:

- subtle page texture overlay
- dark decorative underlayer behind gradients
- masked decorative patch in hero or footer

Why it is useful:

- low-detail and atmospheric
- easy to blend with CSS gradients

Important note:

Use at low opacity only. It should support the page, not dominate it.

### 5. Tile art

Files:

- `/front/public/cards.png`
- `/front/public/hand_cards.png`

Recommended use:

- hero corner decoration
- empty-state illustration
- tournament card accent
- loading or transition art
- homepage spotlight decoration

Why it is useful:

- instantly communicates mahjong identity
- works well as a secondary visual motif

Do not do this:

- do not use tile art as a clickable button body
- do not overuse it in dense data views

## Group B: Reference Only or Redraw

These assets are visually useful, but should mainly guide your own implementation.

### 1. Screenshot references

Files:

- `/front/public/qh_main.png`
- `/front/public/qh_tounaments_page.png`

Recommended use:

- layout study
- spacing study
- hierarchy study
- color ratio study
- animation feel study

Why reference only:

- they are full screenshots, not modular assets
- direct reuse will break responsiveness
- direct reuse makes the UI feel pasted together

### 2. Match lobby action atlas

File:

- `/front/public/game.maj-soul.com/1/v0.11.217.w/res/atlas/myres/match_lobby1.png`

Recommended use:

- inspiration for feature entry cards
- inspiration for tournament quick-action blocks
- inspiration for icon-plus-title layout

Why reference only:

- the text and frame proportions are very specific
- direct use will limit flexibility
- easier to rebuild in CSS and SVG than to force-fit the atlas

### 3. Side utility strip

File:

- `/front/public/game.maj-soul.com/1/v0.11.188.w/res/atlas/myres/lobby7.png`

Recommended use:

- icon style reference
- vertical tool rail inspiration
- notification badge treatment reference

Why reference only:

- highly game-specific
- visually noisy in a web app
- better as a mood board than as production UI

### 4. Rules and point atlases

Files:

- `/front/public/game.maj-soul.com/1/v0.11.86.w/res/atlas/myres/rules_point.png`
- `/front/public/game.maj-soul.com/1/v0.11.86.w/res/atlas/myres/rules_point1.png`
- `/front/public/game.maj-soul.com/1/v0.11.86.w/res/atlas/myres/rules_point2.png`
- `/front/public/game.maj-soul.com/1/v0.11.86.w/res/atlas/myres/rules_point3.png`
- `/front/public/game.maj-soul.com/1/v0.11.104.w/res/atlas/myres/liandong_rules.png`

Recommended use:

- visual reference for rule cards
- inspiration for parameter panels
- inspiration for tournament settings UI

Why reference only:

- too tied to Mahjong Soul's original rule pages
- likely to cause visual mismatch if pasted directly

## Group C: Do Not Use Directly

These assets should stay out of the main production UI except for rare internal prototypes.

### 1. Game runtime files

Files:

- `/front/public/game.maj-soul.com/1/index.html`
- `/front/public/game.maj-soul.com/1/sw.js`
- `/front/public/game.maj-soul.com/1/v0.11.240.w/code.js`

Reason:

- not useful for your React frontend styling
- introduces confusion and maintenance noise

### 2. Event and activity atlases

Examples:

- `activity_sign.png`
- `activity_qiri.png`
- `activity_qiri1.png`
- `activity_question*.png`
- `activity_interval*.png`
- `activity_entrance*.png`
- `activity_yindao.png`
- `activity_bingo.png`
- `activity_bingo1.png`
- `activity_base*.png`
- `activity_fanpai.png`
- `activity_banner/*`

Reason:

- too campaign-specific
- visually inconsistent across versions
- many are built for temporary game events rather than stable app UI

Possible exception:

If a single banner has a clean decorative frame, extract only the ornament, not the full banner.

### 3. Shop, treasure, monthly card, and growth atlases

Examples:

- `shop.png`
- `shop/skin_choose.png`
- `shop/gift_pack.png`
- `treasure*.png`
- `yueka*.png`
- `star_up/*`
- `achievement*.png`
- `amulet*.png`

Reason:

- these belong to monetization or character progression systems
- they carry a different product meaning than your current frontend
- direct reuse will make the app feel inconsistent

### 4. Character or face assets

Examples:

- `mjpface_*`
- `get_character.png`
- `player_info*`

Reason:

- stylistically attractive but too product-specific
- can distract from the tournament and public-hall focus

## Homepage Placement Suggestions

Use the assets below in the first redesigned homepage.

Target page:

- `/front/src/pages/PublicHallHomePage.tsx`

Supporting feature files:

- `/front/src/features/public-hall/components/shared.home.tsx`
- `/front/src/features/public-hall/components/sections.tsx`

### Area 1: Page background

Use:

- `background.jpg`

Implementation suggestion:

- blend it with CSS gradients
- apply low opacity
- keep text contrast high

### Area 2: Hero section title frame

Use:

- fragments from `lobby.png`

Implementation suggestion:

- slice the gold-edged title strip
- use it behind the main page heading or section label

### Area 3: Tabs and mode switchers

Use:

- fragments from `match_lobby.png`
- visual ideas from `room.png`

Implementation suggestion:

- create CSS-backed tabs with a Mahjong Soul style track
- use extracted ornament only for active-state caps or underlines

### Area 4: Section headers and summary bars

Use:

- fragments from `lobby.png`
- fragments from `match_lobby.png`

Implementation suggestion:

- create a shared `section header` component
- allow title, eyebrow, action area, and ornamental left cap

### Area 5: Empty state or hero embellishment

Use:

- `cards.png`
- `hand_cards.png`

Implementation suggestion:

- tuck tiles into the corner of a hero block
- add a faded hand illustration near public-hall or tournament sections

### Area 6: Tournament ops quick actions

Use:

- `match_lobby1.png` as structural inspiration

Implementation suggestion:

- rebuild quick-entry cards in code
- borrow shape, icon placement, and plaque feeling

## Practical Build Guidance

When using these assets in code, prefer this order of implementation:

1. CSS gradients and shadows first
2. extracted ornament fragments second
3. tile illustrations third
4. screenshot-based reference adjustments last

This keeps the UI maintainable and responsive.

## Asset Handling Recommendations

Before actual implementation, create a cleaner frontend-facing asset layer.

Suggested folders:

- `/front/public/mahjong-soul/decorative`
- `/front/public/mahjong-soul/reference`
- `/front/public/mahjong-soul/tiles`

Suggested content split:

- `decorative`: cropped frame pieces, trims, title bars, texture pieces
- `reference`: full screenshots and large atlas references
- `tiles`: mahjong tile images and hands

This avoids importing deep versioned Mahjong Soul paths directly in app code.

## Final Recommendation

The best production strategy is:

- directly reuse ornamental frame pieces
- directly reuse low-opacity texture assets
- directly reuse mahjong tile illustrations
- redraw or rebuild buttons, tabs, cards, and panels in your own component system
- keep screenshots and large atlases as reference, not as assembled UI

If the homepage is the first redesign target, then the highest-value assets to touch first are:

1. `background.jpg`
2. `lobby.png`
3. `match_lobby.png`
4. `cards.png`
5. `hand_cards.png`
