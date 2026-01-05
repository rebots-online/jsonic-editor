# Checklist — Graph Interaction Enhancements (2025-12-31 02:18:22 UTC)

Status legend: [ ] not started, [/] in progress, [x] done (awaiting test), ✅ tested & complete.

- [x] Capture current architecture and event-flow plan in `docs/ARCHITECTURE/architecture-20251231-021822.md`.
- [x] Extend `jsonic/src/utils/jsonParser.ts` with graph mutation helpers:
  - `removeNode(graph, nodeId)` to delete node and descendant edges, reassign children as needed.
  - `moveNode(graph, nodeId, newParentId)` to update parent reference, children arrays, and edge endpoints while preserving positions.
  - `addEdge(graph, sourceId, targetId, type)` utility for future-proofing (parent edges only for now).
- [x] Upgrade `jsonic/src/components/GraphView.tsx`:
  - Preserve Cytoscape instance with stable layout; update elements without auto re-layout unless positions missing.
  - Register event listeners: double-click for edit, contextmenu for node actions, drag/position change for move, tap background deselect, zoom/pan tracking.
  - Implement keyboard navigation: Tab/Shift+Tab cycles nodes, Ctrl+Arrow traverses parent/child/sibling (based on edges/children data), Enter triggers edit.
  - Expose callbacks with structured payloads `{ id, key, type, value, position, parentId }` etc.
  - Provide at least one context menu (node) with actions: Edit, Add Child, Delete (with confirm), Center/Focus.
- [x] Implement App-level callbacks in `jsonic/src/App.tsx` using utilities:
  - `handleNodeCreate`, `handleNodeEdit`, `handleNodeDelete`, `handleNodeMove`, `handleNodeSelect`.
  - Maintain layout stability by preserving/propagating `position` on nodes; avoid resetting Cytoscape layout unnecessarily.
  - Synchronize `textContent` after graph mutation via `graphToJson`.
  - Confirm deletes with `window.confirm` guard.
- [x] Wire callbacks to both graph view instances (graph and split view) and status messaging where applicable.
- [x] Ensure keyboard shortcuts and context menus do not conflict with existing toolbar shortcuts; document keymap hints in code comments if helpful.
- [✅] Smoke test UI logic (unit tests unavailable): run `npm test`/`npm run lint` if configured, otherwise basic type check/build command; note outcomes.
- [✅] Update checklist statuses post-implementation and testing.
