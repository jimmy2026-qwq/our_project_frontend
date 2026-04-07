# RiichiNexus Frontend Docs

This directory now uses smaller documents grouped by topic instead of a single large README.

Start here:

- [Architecture](./architecture.md)
- [Feature Guide](./features.md)
- [Backend Interfaces](./backend-interfaces.md)
- [Development Notes](./development.md)
- [Tournament Flow](./tournaments.txt)

Existing reference documents:

- [Frontend Interface Contracts](./FRONTEND_INTERFACE_CONTRACTS.md)
- [Demo Frontend API](./DEMO_FRONTEND_API.md)
- [Frontend Template Migration Plan](./frontend-template-migration-plan.md)
- [Introduction](./introduction.txt)
- [Requirements](./requirements.txt)

Quick summary:

- app entry is `front/src/main.tsx`
- routing is handled by `react-router-dom`
- shared API access lives in `front/src/api/*`
- the app still follows an API-first with mock-fallback strategy
- the main product areas are blueprint home, public hall, member hub, and tournament operations
