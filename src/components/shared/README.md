# Shared UI Boundaries

This folder is the current reusable UI layer for `front/`.

The goal is to keep feature code shorter without forcing a full template-style UI migration too early.

## Import Rule

Prefer importing from the closest shared subfolder that matches the component responsibility:

- `@/components/shared/layout`
- `@/components/shared/data-display`
- `@/components/shared/feedback`
- `@/components/shared/forms`

Use `@/components/shared` as a convenience barrel only when a file genuinely needs components from multiple shared groups and the combined import stays readable.

## Folder Rules

### `layout/`

Use for:

- section headers
- panel headers
- toolbars
- filter wrappers
- generic action buttons

Keep components here when they mostly arrange content or actions, and do not define a domain-specific data view.

Examples:

- `SectionIntro`
- `PanelHead`
- `FiltersHead`
- `ControlToolbar`
- `PortalFilters`
- `ActionButton`

Do not put here:

- empty or loading states
- source badges or warnings
- list/detail content shells that define a concrete data presentation pattern

### `data-display/`

Use for:

- reusable content shells
- panel wrappers that combine title, metadata, and body
- detail heroes
- detail cards
- section wrappers that already imply a content presentation pattern

Keep components here when they describe how data is displayed, not just how content is arranged.

Examples:

- `DataPanel`
- `PortalSection`
- `DetailHero`
- `DetailCard`

Do not put here:

- primitive buttons
- generic layout wrappers with no display semantics
- feature-specific cards that only appear in one business module

### `feedback/`

Use for:

- loading states
- empty states
- source labels
- warning surfaces

Keep components here when the main job is to communicate status, availability, or provenance.

Examples:

- `SourceBadge`
- `EmptyState`
- `LoadingCard`

Do not put here:

- full data panels
- section wrappers
- form controls

### `forms/`

Use for:

- reusable labeled field wrappers
- shared select, input, textarea, and checkbox shells
- small field-group wrappers that standardize form structure without owning feature state

Keep components here when they standardize field markup and native control usage, while leaving validation, state, and business meaning inside the feature.

Examples:

- `FieldGroup`
- `SelectField`
- `TextInputField`
- `TextareaField`
- `CheckboxField`

Current API convention:

- labeled controls accept `label` and pass through native control props
- `FieldGroup`, `SelectField`, `TextInputField`, and `TextareaField` default to the shared field wrapper class
- `CheckboxField` keeps the checkbox-specific wrapper class by default

Do not put here:

- feature-specific form copy
- submit or mutation logic
- provider-backed validation or form libraries that are not yet needed

## Promotion Rule

Promote a component into `shared/` only when at least one of these is true:

- the same UI pattern appears in 2 or more features
- the component expresses a stable app-wide interaction or display convention
- extracting it makes a feature file meaningfully shorter or easier to read

If a component still carries business-specific copy, state, or assumptions that only make sense in one feature, keep it inside that feature for now.

## Migration Rule Of Thumb

Prefer moving code from feature files into `shared/` only after the pattern is clear.

Do not create shared components just to imitate the template directory structure.
