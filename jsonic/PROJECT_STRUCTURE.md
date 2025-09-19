# Project Structure

```
jsonic/
├── src-tauri/
│   ├── src/
│   │   ├── main.rs
│   │   ├── commands.rs
│   │   ├── file_handler.rs
│   │   └── json_comments.rs
│   ├── Cargo.toml
│   └── tauri.conf.json
├── src/
│   ├── components/
│   │   ├── GraphView.tsx
│   │   ├── TextEditor.tsx
│   │   ├── Toolbar.tsx
│   │   ├── Node.tsx
│   │   └── StatusBar.tsx
│   ├── hooks/
│   │   ├── useGraph.ts
│   │   ├── useKeyboardNavigation.ts
│   │   └── useFileOperations.ts
│   ├── utils/
│   │   ├── jsonParser.ts
│   │   ├── graphUtils.ts
│   │   └── fileUtils.ts
│   ├── types/
│   │   ├── index.ts
│   │   └── jsonTypes.ts
│   ├── config/
│   │   ├── cytoscapeStyles.ts
│   │   └── cytoscapeLayouts.ts
│   ├── styles/
│   │   └── app.css
│   ├── App.tsx
│   ├── main.tsx
│   └── index.html
├── package.json
├── tsconfig.json
├── webpack.config.js
├── README.md
├── LICENSE
└── IMPLEMENTATION_PLAN.md
```