# Development Notes

## Current Priorities

The highest-value remaining cleanup is structural, not framework-level.

Recommended next work:

- continue shrinking backend-specific transport compatibility helpers
- add one more layer of frontend tests above pure mapper/shared-data functions
- keep syncing docs whenever transport cleanup removes another legacy edge
- keep shared UI consolidation moving out of broad global CSS

## Requirements-Focused Reading

The current codebase already does reasonably well on:

- module separation
- frontend/backend contract naming in the tournament and club application flows
- keeping `public-hall` feature code dependent on shared contracts plus mappers

The remaining weaker spots against `requirements.txt` are:

- transport and type-system boundaries are much cleaner than before, but backend-specific option encoding still exists in a narrow helper layer
- frontend quality gates exist now (`lint`, `test`, `typecheck`, `build`), but test coverage is still concentrated on pure functions
- some documentation can drift quickly when transport compatibility helpers are retired

## Connection Setup

- API base env var: `VITE_API_BASE_URL`
- default frontend API prefix: `/api`
- Vite dev proxy file: `front/vite.config.ts`
- current proxy target: `http://127.0.0.1:8080`

## Working Rule

When adding new frontend/backend work:

- put transport contracts in `front/src/api/contracts/*`
- keep normalization in API modules or dedicated mappers
- avoid creating feature-local copies of transport contracts unless the feature truly owns a different domain shape
