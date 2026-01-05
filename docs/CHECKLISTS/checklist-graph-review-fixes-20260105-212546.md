# Checklist — Graph review fixes (2026-01-05 21:25:46 UTC)

Status legend: [ ] not started, [/] in progress, [x] done (awaiting test), ✅ tested & complete.

- [x] Record architecture/plan in `docs/ARCHITECTURE/architecture-20260105-212546.md`.
- [x] Add edge `type` metadata to Cytoscape elements in `jsonic/src/components/GraphView.tsx` for traversal selectors.
- [x] Guard against moving a node under itself/descendants in `jsonic/src/utils/jsonParser.ts` `moveNode` helper.
- [✅] Run `npm run build` (or available checks) and capture results.
- [✅] Update checklist statuses after implementation/testing.
