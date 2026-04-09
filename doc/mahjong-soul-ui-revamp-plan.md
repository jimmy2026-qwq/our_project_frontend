# Mahjong Soul Style UI Revamp Plan

## Goal

This document describes how to transform the frontend in `/front` into a UI style inspired by Mahjong Soul lobby screens while keeping the existing business logic and backend contracts as stable as possible.

The target is not to clone Mahjong Soul pixel by pixel. The goal is to borrow its visual language:

- bright layered backgrounds
- elegant gold and cyan accents
- floating lobby-style panels
- large scene-first navigation
- soft glow, glass, and ornamental framing
- game-lobby atmosphere instead of admin-dashboard atmosphere

## Scope

Primary workspace:

- `/front`

Reference sources:

- `/front/public/qh_main.png`
- `/front/public/qh_tounaments_page.png`
- `/front/public/fonts`
- `/template/frontend`

Backend workspace:

- `/our_project`

The backend should remain unchanged unless the new UI needs new aggregated fields or endpoints.

## Current Situation

The current frontend already has:

- `React 19`
- `Vite`
- `Tailwind CSS 4`
- a reusable UI component layer in `src/components/ui`
- page-level feature separation in `src/features/*`
- a top-level application shell in `src/app/AppShell.tsx`

This means the correct strategy is:

1. rebuild the visual system first
2. rebuild the global shell second
3. redesign one sample page end to end
4. migrate the remaining pages in batches

Do not start by editing all pages at once.

## High-Level Strategy

The migration should happen in four layers.

### Layer 1: Design Tokens

Replace the current dark technical dashboard token set with a Mahjong Soul inspired lobby token system.

Focus areas:

- color palette
- typography
- shadows and glow
- border styles
- panel radius
- spacing scale
- motion timing

Main file:

- `src/index.css`

### Layer 2: Global Shell

Replace the current app shell with a lobby-like stage layout.

Focus areas:

- top status bar
- main lobby stage
- shortcut entry cards
- framed content island
- decorative background layers

Main file:

- `src/app/AppShell.tsx`

### Layer 3: Shared UI Components

Upgrade shared components so all pages inherit the new style.

Focus areas:

- buttons
- cards
- tabs
- badges
- dialog
- input
- tables
- section containers

Main folder:

- `src/components/ui`

### Layer 4: Feature Pages

Migrate actual pages one group at a time after the shell and shared components are stable.

Priority order:

1. public hall
2. member hub
3. tournament operations
4. login and register
5. detail pages

## Phase-by-Phase Plan

## Phase 0: Collect Visual References

### Objective

Turn the visual inspiration into a concrete implementation checklist.

### Actions

1. Review the following files carefully:
   - `/front/public/qh_main.png`
   - `/front/public/qh_tounaments_page.png`
2. Write down the visible patterns:
   - page background treatment
   - panel shape language
   - primary button treatment
   - accent color usage
   - navigation layout
   - decorative line work
   - text hierarchy
3. Separate visual features into:
   - must have
   - nice to have
   - avoid
4. Define the adaptation rule:
   - inspired by Mahjong Soul
   - compatible with current business pages
   - maintain readable information density

### Deliverable

A small internal checklist that guides all later implementation decisions.

### Notes

Avoid blindly copying details that only work for a pure game launcher, such as oversized empty space, excessive decorative art, or hidden data density.

## Phase 1: Build the Visual Foundation

### Objective

Create a reusable design system so later page changes are fast and consistent.

### Main Files

- `src/index.css`
- optional new style helpers under `src/styles`

### Actions

1. Replace the root variables in `src/index.css`.
2. Define a new token set for:
   - `--bg-page`
   - `--bg-stage`
   - `--bg-panel`
   - `--bg-panel-soft`
   - `--text-primary`
   - `--text-secondary`
   - `--accent-gold`
   - `--accent-cyan`
   - `--line-soft`
   - `--line-strong`
   - `--glow-gold`
   - `--glow-cyan`
3. Redesign the global background:
   - soft sky or mist gradient
   - subtle radial highlights
   - ornamental texture or grid used very lightly
4. Add typography rules:
   - titles feel elegant and ceremonial
   - body text remains clean and readable
   - numeric data keeps strong contrast
5. Add consistent panel surface rules:
   - translucent light panels
   - layered borders
   - soft inner highlight
   - slightly floating shadow
6. Define animation primitives:
   - page fade in
   - card lift on hover
   - tab glow on active

### Acceptance Criteria

- the app already feels like a different product before page content is changed
- all pages inherit the same palette and spacing language
- no component still depends visually on the old dark admin style

## Phase 2: Rebuild the Global Shell

### Objective

Turn the top-level application frame into a lobby-like layout.

### Main File

- `src/app/AppShell.tsx`

### Actions

1. Replace the current heavy header + nav stack with a staged shell.
2. Split the shell into:
   - top profile/status strip
   - main hero area
   - quick-access navigation area
   - framed route content area
3. Change navigation behavior:
   - prefer prominent destination cards or elegant tabs
   - avoid plain admin-style rectangular menu blocks
4. Add a visual center of gravity:
   - main banner
   - event panel
   - highlighted featured mode
5. Keep route content inside a reusable decorated panel wrapper.
6. Preserve existing auth logic and logout flow.

### Suggested Shell Structure

- top bar: player name, identity, quick actions
- hero area: featured mode, announcement, seasonal highlight
- route panel: page-specific content
- footer: light informational links only

### Acceptance Criteria

- even an unchanged page looks like it belongs to a game lobby
- navigation reads as destination-driven, not back-office-driven
- the shell remains responsive on laptop and mobile widths

## Phase 3: Upgrade Shared Components

### Objective

Make shared components carry the new style automatically across the application.

### Main Folder

- `src/components/ui`

### Candidate Files

- `button.tsx`
- `card.tsx`
- `tabs.tsx`
- `badge.tsx`
- `dialog.tsx`
- `input.tsx`
- `table.tsx`
- `section-callout.tsx`
- `info-card.tsx`

### Actions

1. Redesign button variants:
   - primary gold luminous button
   - secondary cyan framed button
   - ghost transparent button
2. Redesign cards:
   - softer surfaces
   - ornamental header options
   - layered border and highlight
3. Redesign tabs:
   - larger clickable targets
   - active glow
   - elegant background track
4. Redesign badges and pills:
   - rank, status, category, schedule state
5. Redesign dialogs:
   - framed pop-up style
   - dimmed backdrop with soft bloom
6. Redesign form controls:
   - brighter surfaces
   - less technical appearance
   - stronger focus states
7. Redesign tables where necessary:
   - avoid pure spreadsheet look
   - convert some data views to cards if it improves the lobby style

### Acceptance Criteria

- component style is consistent across pages
- new pages can be assembled from shared components without custom styling everywhere
- hover, focus, and active states all look intentional

## Phase 4: Build a Sample Flagship Page

### Objective

Use one page as the full design reference for the rest of the migration.

### First Target

- `src/pages/PublicHallHomePage.tsx`
- related files under `src/features/public-hall`

### Why This Page First

The public hall already maps naturally to a Mahjong Soul style lobby:

- hero area
- featured schedules
- clubs
- leaderboard
- tabbed content

### Actions

1. Redesign `PublicHallHero` into a central lobby showcase area.
2. Convert overview strips into polished statistic tiles.
3. Redesign view switching tabs as mode-selector controls.
4. Reframe schedules, clubs, and leaderboard as distinct island panels.
5. Add hierarchy:
   - hero first
   - quick summary second
   - switchable main content third
6. Ensure dense data still remains readable.

### Acceptance Criteria

- this page can serve as the visual benchmark for all later pages
- the layout feels like entering a game lobby, not a management panel
- no business function is lost during redesign

## Phase 5: Migrate Remaining Pages in Batches

### Objective

Roll the style out to the rest of the product without destabilizing the app.

### Suggested Order

1. `member-hub`
2. `tournament-ops`
3. `public detail pages`
4. `login/register`
5. low-traffic utility views

### Page Mapping Guidance

#### Member Hub

Use a more personal, profile-centered layout:

- player card
- membership status
- quick actions
- recent participation

#### Tournament Ops

Keep it functional, but wrap operational sections in the new visual language:

- dashboard summary
- operation panels
- framed forms
- highlighted warnings and status chips

#### Login/Register

Use a cleaner cinematic landing style:

- prominent logo area
- framed authentication panel
- minimal distractions

#### Detail Pages

Treat details as sub-scenes inside the lobby system:

- banner
- summary card
- tabbed detail content

### Acceptance Criteria

- the visual language is consistent across all major routes
- each page still reflects its business purpose
- operational pages remain efficient despite the style upgrade

## Phase 6: Decide When Backend Changes Are Needed

### Objective

Avoid unnecessary backend work, but add support if the new UI needs richer data composition.

### Backend Should Stay Untouched If

- the UI only changes presentation
- existing fields already support the new cards and panels
- current queries are sufficient for page rendering

### Backend May Need Changes If

- hero sections need aggregated summary data
- multiple requests should be combined into one lobby payload
- ranking panels need new derived fields
- event banners need new metadata

### Working Rule

Do not modify `/our_project` during the first design pass.

Only add backend work after a specific UI section proves it lacks data.

## Recommended File-by-File Execution Order

Implement in this order for the safest workflow:

1. `src/index.css`
2. `src/app/AppShell.tsx`
3. `src/components/ui/button.tsx`
4. `src/components/ui/card.tsx`
5. `src/components/ui/tabs.tsx`
6. `src/components/ui/dialog.tsx`
7. `src/components/ui/input.tsx`
8. `src/features/public-hall/components/*`
9. `src/pages/PublicHallHomePage.tsx`
10. remaining feature folders

## Practical Working Method

Use the following operating method during implementation.

### Method A: Branch by Theme

Suggested branch sequence:

1. `codex/ui-theme-foundation`
2. `codex/ui-public-hall`
3. `codex/ui-shared-components`
4. `codex/ui-member-pages`

This keeps each change reviewable and reversible.

### Method B: Keep Screenshots for Each Step

After each phase:

1. run the app
2. take screenshots
3. compare with the previous version
4. verify readability and spacing

### Method C: Preserve Behavior While Replacing Presentation

For each component:

1. keep props unchanged if possible
2. keep data flow unchanged if possible
3. replace markup and styles first
4. only refactor logic when necessary

This prevents UI work from turning into a large logic rewrite.

## Risks and How to Control Them

## Risk 1: The UI becomes decorative but hard to use

Mitigation:

- preserve strong contrast for data
- keep text readable
- avoid overly transparent panels behind dense content
- do not hide important actions inside stylized chrome

## Risk 2: The style becomes inconsistent across pages

Mitigation:

- finish tokens and shared components first
- avoid one-off page CSS unless necessary
- keep a small set of reusable panel and button variants

## Risk 3: Public pages and management pages need different moods

Mitigation:

- share the same token system
- allow page-specific density differences
- keep ops pages cleaner and more functional

## Risk 4: The redesign accidentally forces backend changes too early

Mitigation:

- first build with existing data
- log exactly which UI block is missing data
- only then define backend additions

## Visual Checklist

Before marking the redesign successful, verify the following:

- the app no longer looks like a generic admin dashboard
- the home page has a clear hero focus
- navigation feels like entering destinations, not opening tools
- primary actions have distinctive visual emphasis
- cards feel layered and premium
- colors are controlled and consistent
- motion is subtle and intentional
- mobile and narrow laptop layouts still work

## Suggested First Implementation Milestone

The first concrete milestone should be:

1. rewrite `src/index.css`
2. rebuild `src/app/AppShell.tsx`
3. restyle shared button/card/tab components
4. redesign the public hall homepage as the benchmark page

If this milestone succeeds, the rest of the migration becomes mostly systematic rather than exploratory.

## Final Recommendation

Do not attempt a full-site rewrite in one pass.

Start from the shell and shared tokens, then fully redesign the public hall homepage, then migrate the rest page by page.

This will give you:

- a stable implementation rhythm
- lower regression risk
- clearer review points
- a reusable Mahjong Soul inspired frontend system instead of isolated page patches
