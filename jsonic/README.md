# JSONic - JSON Concept Map Editor

A Tauri-based desktop application that presents JSON files in a visual concept map format, eliminating the need to deal with nested brackets and making JSON editing more intuitive.

## Features

- **Visual JSON Editing**: Display JSON as "thought bubble" nodes in a concept map
- **Dual View**: Switch between graph visualization and text editor
- **Keyboard Navigation**: Navigate and edit with familiar shortcuts (TAB, SHIFT-TAB, CTRL-ARROW)
- **Drag & Drop**: Reorganize nodes with intuitive drag-and-drop
- **Comment Support**: Handle JSON comments using the comment-json library
- **Cross-Platform**: Runs on Windows, macOS, and Linux

## Installation

### Prerequisites

- Node.js (v16 or higher)
- Rust (latest stable version)
- Tauri CLI

### Development Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd jsonic
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Install Tauri CLI:
   ```bash
   npm install -g @tauri-apps/cli
   ```

4. Run in development mode:
   ```bash
   npm run tauri dev
   ```

### Building for Production

```bash
npm run tauri build
```

This will create platform-specific binaries in the `src-tauri/target/release` directory.

## Usage

### File Operations

- **Open File**: `CTRL+O` or use the File menu
- **Save File**: `CTRL+S` or use the File menu
- **New File**: Use the File menu

### Navigation

- **Create Child Node**: `TAB`
- **Return to Parent**: `SHIFT+TAB`
- **Create Sibling**: `ENTER`
- **Navigate Between Nodes**: `CTRL+ARROW KEYS`
- **Edit Node**: Double-click on a node

### Views

- **Graph View**: Visual concept map representation
- **Text View**: Traditional JSON text editor
- **Split View**: Both views side-by-side

## Architecture

The application is built with:

- **Backend**: Rust/Tauri for system-level operations
- **Frontend**: React/TypeScript for UI and visualization
- **Visualization**: Cytoscape.js for graph rendering
- **Text Editing**: Monaco Editor for code editing
- **JSON Parsing**: comment-json for handling JSON with comments

## Project Structure

```
jsonic/
├── src-tauri/          # Tauri backend (Rust)
├── src/                # Frontend (React/TypeScript)
│   ├── components/     # React components
│   ├── utils/          # Utility functions
│   ├── types/          # TypeScript types
│   └── styles/         # CSS styles
├── package.json        # Node.js dependencies
└── README.md           # This file
```

## License

Copyright (C) 2025 Robin L. M. Cheung, MBA. All rights reserved.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## Acknowledgments

- [Tauri](https://tauri.app/) - Build smaller, faster, and more secure desktop applications
- [Cytoscape.js](https://js.cytoscape.org/) - Graph theory library for visualization
- [comment-json](https://www.npmjs.com/package/comment-json) - Parse and stringify JSON with comments