# CHECKLIST-jsonic-core-20260429

Owner: Codex Agent  
Due date: 2026-04-29  
Window: 1 day within requested 1-4 week horizon for MVP gap closure

## Tasks
- [x] (Architecture) Create `docs/ARCHITECTURE/architecture-20260429-161127Z-jsonic-core.md`.
  - Acceptance: file includes AST abstraction + UML + Mermaid flow.
- ✅ (Code) Update `jsonic/src/components/GraphView.tsx`.
  - Required functions: `handleKeyboardNavigation`, `focusNode`, `getTraversalTargets`.
  - Add behavior:
    - TAB -> `onNodeCreate({ parentId: selected.id(), position })`
    - SHIFT+TAB -> focus parent
    - ENTER -> create sibling via parent
    - CTRL+ARROW traversal remains.
  - Acceptance: key events invoke callbacks with correct payload.
- ✅ (Code) Update `jsonic/src/App.tsx`.
  - Required functions: `handleNodeCreate`, new `handleNodeCreateSibling`, `handleApplyTextToGraph`.
  - Variables: keep `selectedNodeId`; derive selected parent with `findNode`.
  - Add global keydown for Ctrl/Cmd+S and Ctrl/Cmd+O.
- ✅ (Code) Update `jsonic/src/components/Toolbar.tsx`.
  - Add `Apply Text` button triggering parse/sync operation.
- ✅ (Code) Update `jsonic/src/components/StatusBar.tsx`.
  - Add version and epoch-minute 5-digit build suffix display.
- [ ] (Code) Update `jsonic/src/styles/app.css` if needed for menu/status layout.
- ✅ (Verification) run `npm run build` (or `npm run test` if present).
- ✅ (Docs) update this checklist states to ✅ for verified tasks.
