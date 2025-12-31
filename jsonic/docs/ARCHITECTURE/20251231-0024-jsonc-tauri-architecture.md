# Architecture & AST Plan — 2025-12-31 00:24 UTC

> Note: External hybrid knowledge graph endpoints (Neo4j/Postgres/Qdrant) are inaccessible in this environment, so synchronization is deferred.

## Baseline AST / Module Inventory
- `src-tauri/src/main.rs`
  - Registers Tauri commands: `open_file`, `save_file`, `parse_json_with_comments`, `stringify_json_with_comments`.
- `src-tauri/src/commands.rs`
  - Thin Tauri command wrappers calling helpers in `file_handler.rs` and `json_comments.rs`.
  - Current risk: helper/import name collisions cause self-recursion for JSON comment functions.
- `src-tauri/src/file_handler.rs`
  - Low-level `read_file`, `write_file` using std fs APIs; minimal error context.
- `src-tauri/src/json_comments.rs`
  - Placeholder JSON parsing/stringifying via `serde_json` (no comment support).
- Dependencies: `tauri` (dialog/fs features), `serde`, `serde_json`.

## Proposed Additions / Revisions
- Introduce `jsonc-parser` (with `serde` + `cst` features) to parse JSONC, capture comment positions, and re-stringify while preserving trivia.
- Create a reusable struct `CommentedDocument` encapsulating:
  - Parsed `serde_json::Value` for app consumption.
  - `CstRootNode` for comment/format retention.
  - Original path + newline/indent style for stable round-tripping.
- Maintain an in-memory cache keyed by absolute path to reuse comment layouts when saving.
- Harden error handling with user-friendly messages and context (path, action, root cause).
- Integrate `tauri::api::dialog::FileDialogBuilder` to select open/save paths when none provided.
- Expose non-recursive command wrappers (e.g., `cmd_parse_json_with_comments`) that delegate to helpers.
- Add unit tests covering:
  - Comment-preserving parse/stringify round-trips.
  - Open/save flows with comment retention and dialog bypass (direct path use).
  - Error propagation for missing files and write failures.

## Data Flow (Mermaid Sequence)
```mermaid
sequenceDiagram
    participant UI
    participant Tauri as Tauri Commands
    participant Comments as json_comments
    participant Files as file_handler
    Note over Tauri,Comments: Commands renamed to avoid helper recursion
    UI->>Tauri: invoke open_file(path?)
    alt path provided
        Tauri->>Files: read_file(path)
    else dialog needed
        Tauri->>Tauri: FileDialogBuilder.pick_file()
        Tauri->>Files: read_file(selected_path)
    end
    Files-->>Tauri: file text or io error
    Tauri->>Comments: parse_with_comments(text, path)
    Comments-->>Tauri: CommentedDocument (value + CST cache)
    Tauri-->>UI: serde_json::Value payload (comments preserved internally)

    UI->>Tauri: invoke save_file(path?, value)
    alt cached path missing and no input
        Tauri-->>UI: friendly error
    else
        Tauri->>Comments: stringify_with_comments(path, value)
        Comments->>Files: write_file(resolved_path, text)
        Files-->>Tauri: ok or io error
    end
    Tauri-->>UI: result status
```

## Structural Relationships (UML-ish Mermaid)
```mermaid
classDiagram
    class CommentedDocument {
      +path: Option<PathBuf>
      +value: serde_json::Value
      +root: CstRootNode
      +newline_kind: CstNewlineKind
    }
    class CommentCache {
      +docs: Mutex<HashMap<PathBuf, CommentedDocument>>
      +insert(doc)
      +get(path) -> Option<CommentedDocument>
    }
    class JsonCommentsService {
      +parse(text, path) Result<CommentedDocument, String>
      +stringify(path, value) Result<String, String>
    }
    class Commands {
      +cmd_open_file(path: Option<String>) -> Result<Value,String>
      +cmd_save_file(path: Option<String>, value: Value) -> Result<(),String>
      +cmd_parse_json_with_comments(json: String) -> Result<Value,String>
      +cmd_stringify_json_with_comments(value: Value) -> Result<String,String>
    }
    class FileHandler {
      +read_file(path:&str)->Result<String,IoError>
      +write_file(path:&str,content:&str)->Result<(),IoError>
    }

    JsonCommentsService --> CommentCache
    Commands --> JsonCommentsService
    Commands --> FileHandler
```

## Edge Cases & Error Strategy
- Missing path -> prompt via dialog; if canceled, return explicit "No file selected" message.
- IO errors -> wrap with actionable guidance (permission denied, not found).
- Parse errors -> include snippet location when available from `jsonc-parser` diagnostics.
- Save with stale cache -> fallback to formatted JSONC without comments but warn in message.

## Testing Plan (overview)
- Unit tests in `src-tauri/src` exercising commands directly.
- Use `tempfile` for isolated file system checks.
- Verify round-trip: write sample JSONC with line/inline comments, parse, stringify, compare normalized output retaining comments structure.
