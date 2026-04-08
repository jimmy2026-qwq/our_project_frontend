# Development Notes

## Recommended Next Work

High-value near-term improvements:

- continue pruning superseded helpers, exports, and style blocks now that shared shells are stable
- continue tightening naming and ownership boundaries across `components/ui`, `components/shared`, and `components/shared/domain`
- keep reusing the root notice and dialog layer instead of introducing local one-off feedback or confirm implementations
- add a real public tournaments index page
- add a richer public clubs search or sort page
- keep expanding tournament operations from table-level actions into tournament-level actions

Longer-term improvements:

- continue reducing reliance on `front/src/styles/app.css`
- move gradually toward the template-oriented frontend stack as the system grows
- introduce a stronger shared UI and state layer aligned with `template/frontend`
- adopt Tailwind and shadcn-style patterns in staged migration work where they clearly reduce duplication

## Connection Setup

- API base env var: `VITE_API_BASE_URL`
- default API prefix in frontend: `/api`
- Vite dev proxy file: `front/vite.config.ts`
- current proxy target: `http://127.0.0.1:8080`
