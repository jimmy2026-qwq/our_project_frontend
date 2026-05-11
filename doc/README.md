# RiichiNexus Frontend Docs

This directory is the current project-facing documentation set for the frontend and the frontend/backend contract boundary.

Start here:

- [Architecture](./architecture.md)
- [Feature Guide](./features.md)
- [Backend Interfaces](./backend-interfaces.md)
- [Development Notes](./development.md)
- [Run Notes](./run.txt)
- [Requirements](./requirements.txt)

Reference documents:

- [Frontend Interface Contracts](./FRONTEND_INTERFACE_CONTRACTS.md)
- [Demo Frontend API](./DEMO_FRONTEND_API.md)
- [Tournament Flow](./tournaments.txt)
- [Frontend Template Migration Plan](./frontend-template-migration-plan.md)
- [Introduction](./introduction.txt)

Quick summary:

- app entry is `front/src/main.tsx`
- router config lives in `front/src/router.tsx`
- shared API access lives in `front/src/api/*`
- the main mounted product surfaces are public hall, blueprint, player dashboard, and table workflow
- backend implementation structure now lives primarily under `our_project/src/main/scala/riichinexus/*`
