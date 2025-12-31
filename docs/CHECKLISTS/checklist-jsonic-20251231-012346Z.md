# Checklist — JSONIC Editor — 2025-12-31 01:23:46 UTC

## Prep
- [x] Create architecture document in `docs/ARCHITECTURE/architecture-jsonic-20251231-012346Z.md`.
- [x] Confirm existing component props and types in `jsonic/src/App.tsx`, `jsonic/src/components/StatusBar.tsx`, `jsonic/src/utils/jsonParser.ts`.

## Implementation Steps
- [x] Update `jsonic/src/App.tsx` imports to include `invoke` from `@tauri-apps/api/tauri` plus `graphToJson`, `jsonToGraph`, and error/status state typing.
- [x] Add new `statusMessage` state (level + text) in `App` to surface errors/info to `StatusBar`.
- [x] Implement `syncGraphAndText(jsonValue)` helper in `App` to set `graph` via `jsonToGraph` and `textContent` via `JSON.stringify(jsonValue, null, 2)`.
- [x] Implement `handleOpenFile` to call `invoke('cmd_open_file', { path: currentFile ?? undefined })`, pass result to `syncGraphAndText`, update `currentFile` when available, and set status (info or error).
- [x] Implement `handleSaveFile` to derive JSON payload (prefer parsing `textContent`, fallback to `graphToJson(graph)`), call `invoke('cmd_save_file', { path: currentFile ?? undefined, content })`, and set status (info or error); avoid swallowing exceptions.
- [x] Implement `handleNewFile` to reset `graph` (empty JsonGraph), `textContent` (empty string), `currentFile` (null), and clear status.
- [x] Ensure `Toolbar` and `TextEditor` receive the shared handlers (`handleOpenFile`, `handleSaveFile`, `handleNewFile`) without view-specific duplication.
- [x] Extend `StatusBar` component props to accept `status` (level + message) and render user-visible notice alongside file info/counts.

## Testing
- ✅ Run targeted TypeScript/webpack build check if available (e.g., `npm run build` or `npm run dev -- --mode production`).
- [x] Manually review `App.tsx` to verify shared handler usage in graph/text/split views.

## Wrap-up
- [x] Update checklist status to reflect completed steps.
- [x] Run `git status` to confirm tracked changes.
- [x] Commit changes with a clear message.
- [x] Generate PR body/title via `make_pr` tool.
