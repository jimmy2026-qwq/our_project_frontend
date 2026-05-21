# Frontend Tailwind Migration Plan

## Goal

Move all page and component styling to Tailwind classes.

The frontend sample sets the target rule:

- `src/main.tsx` imports only `./index.css`.
- `src/index.css` contains only `@import "tailwindcss";`.
- There are no extra `.css` files under `src`.
- Components and pages express styling through Tailwind class names.
- Reusable component variants use TypeScript helpers such as `cva` and `cn`, not CSS selectors.

For this project, the final state should match the sample:

```css
@import "tailwindcss";
```

No ordinary CSS selectors, global CSS variables, `@apply`, page CSS files, or feature CSS files should remain.

## Current Gap

`src/main.tsx` currently imports Tailwind plus several traditional CSS files:

- `src/index.css`
- `src/styles/app.css`
- `src/styles/public-hall-home.css`
- `src/styles/public-hall-detail.css`
- `src/styles/public-hall-lobby.css`
- `src/styles/template-shell.css`

`src/index.css` also still contains global rules such as `:root`, `body`, reset rules, background decoration, and template shell classes.

The largest migration areas are:

- UI primitive styles such as `.ui-button`, `.ui-card`, `.ui-dialog-*`, `.ui-table-*`, `.ui-tabs-*`.
- App shell and provider styles such as `.app-shell`, `.app-dialog`, `.app-notice`.
- Shared layout classes such as `.section`, `.card`, `.list-row`, `.metric-*`, `.guest-flow-*`.
- PublicHall visual shells, especially `public-hall-home.css`, `public-hall-detail.css`, and `public-hall-lobby.css`.

## Migration Rules

1. Keep styling in `className`, component-level class constants, `cva`, or `cn`.
2. Do not add new CSS files.
3. Do not move CSS rules into `index.css`.
4. Do not use `@apply`.
5. Replace pseudo-element decoration with explicit JSX elements using `aria-hidden="true"`.
6. Prefer shared UI components for repeated styling instead of repeated long class strings.
7. Preserve existing UI layout and visual behavior while migrating.
8. After each stage, run typecheck, tests, build, and lint.

## Recommended Order

### 1. Stabilize Structure First

Before large style migration, keep page ownership clean:

- Shared page objects should live under `src/pages/objects`.
- Pages should not depend on another page family's private components.
- PublicHall-specific components should remain under `src/pages/PublicHall`.

This reduces conflicts while style classes are being moved into JSX.

### 2. Migrate UI Primitives

Convert foundational UI components first:

- `Button`
- `Card`
- `Dialog`
- `Badge`
- `Alert`
- `Table`
- `Tabs`
- `Skeleton`
- `EmptyState`
- `Fieldset`
- `DescriptionList`
- `KeyValueList`
- `StatusPill`
- `DetailLayout`
- `PortalSection`
- `WorkbenchPanel`

Expected result:

- Most `.ui-*` selectors disappear from `app.css`.
- Component default styles live directly inside their component files.
- Variants live in `cva` where the component has meaningful modes.

### 3. Migrate App Shell And Providers

Move app-level styling out of CSS:

- `AppShell`
- `RequireAuth`
- `RequireRegisteredUser`
- `DialogProvider`
- `AppFeedbackProvider`

Global background effects currently implemented with `body::before` and `body::after` should become explicit shell decoration elements.

Expected result:

- `.app-shell-*`
- `.app-dialog-*`
- `.app-notice-*`
- `.template-*`

should no longer need CSS selectors.

### 4. Migrate Common Layout Helpers

Replace shared CSS helper classes with Tailwind:

- `.hero`
- `.section`
- `.card`
- `.section__header`
- `.list`
- `.list-row`
- `.metric-*`
- `.guest-flow-*`
- `.shared-*`

Where a pattern repeats often, create or update a component rather than repeating the full class string everywhere.

Expected result:

- Remaining `app.css` should mostly contain page-specific legacy styles, not core component styles.

### 5. Migrate Smaller Pages

Migrate pages with less visual complexity before PublicHall:

1. `Auth`
2. `MemberHubPage`
3. `TournamentOpsPage`
4. `TableMatchPage`
5. `TablePaifuPage`
6. `PlayerDashboardPage`

Each page should keep its existing layout and interaction behavior.

Expected result:

- These page folders no longer depend on legacy CSS selectors.
- Their components use Tailwind classes directly or shared Tailwind-based UI primitives.

### 6. Migrate PublicHall Last

PublicHall has the heaviest visual CSS and should be migrated after the shared components are stable.

PublicHall has two different visual systems and they must not be merged:

- `PublicHall/HomePage` keeps the existing public lobby appearance. Migrate it by directly translating the old `public-hall-home.css` and `public-hall-lobby.css` rules to Tailwind classes.
- `PublicHall/TournamentDetailPage` and `PublicHall/ClubDetailPage` should later share the newer detail-page UI pattern that was established during `PlayerDashboardPage`; do not restyle the public lobby to match that detail UI.

Suggested PublicHall order:

1. `PublicHall/HomePage`
2. PublicHall shared shell components
3. `TournamentDetailPage`
4. `ClubDetailPage`
5. PublicHall lobby visual shell

For complex visual blocks, prefer splitting JSX into smaller presentational components with local class constants.

Expected result:

- `public-hall-home.css` can be deleted.
- `public-hall-detail.css` can be deleted.
- `public-hall-lobby.css` can be deleted.

### 7. Remove CSS Imports And Files

After all class references are migrated:

1. Remove legacy CSS imports from `src/main.tsx`.
2. Delete `src/styles/app.css`.
3. Delete `src/styles/public-hall-home.css`.
4. Delete `src/styles/public-hall-detail.css`.
5. Delete `src/styles/public-hall-lobby.css`.
6. Delete `src/styles/template-shell.css`.
7. Reduce `src/index.css` to only:

```css
@import "tailwindcss";
```

### 8. Add Enforcement

Add an automated check so the rule does not regress.

Suggested checks:

- `src/index.css` must exactly contain `@import "tailwindcss";`.
- No `.css` files may exist under `src` except `src/index.css`.
- `src/main.tsx` may import only `./index.css` as a stylesheet.

This can be implemented as a small script and wired into lint or CI.

## Validation

After every migration stage, run:

```bash
npm.cmd run typecheck
npm.cmd run test
npm.cmd run build
npm.cmd run lint
```

For PublicHall and other visually dense pages, also run browser screenshot checks after starting the dev server.

## Notes

- This migration should be done in stages, not as one large rewrite.
- PublicHall should be last because it contains the most complex visual CSS.
- The goal is not to redesign the UI. The goal is to preserve the current UI while moving the styling mechanism to Tailwind.
