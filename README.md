# JSONIC Editor

**Visual JSON editing without the bracket-matching headaches**

JSONIC Editor is a web-based application that transforms JSON file editing from a text-based exercise to an intuitive visual concept map experience. Instead of wrestling with nested brackets and syntax errors, users interact with JSON data through "thought bubble" nodes that make structure immediately apparent.

## 🌟 Features

### Core Functionality
- **🎨 Visual JSON Editor**: Interact with JSON through intuitive "thought bubble" nodes
- **⌨️ Keyboard Navigation**: Full keyboard control with Tab, Shift+Tab, and Ctrl+Arrow keys
- **🎭 Multiple Themes**: 5 built-in themes including Light, Dark, Glassmorphic, Retro Terminal, and Brutalist
- **📁 File Operations**: Complete open/save functionality with browser-based dialogs
- **↩️ Undo/Redo System**: Full change history with time-travel debugging
- **🔍 Real-time Validation**: Instant feedback with comprehensive error checking

### Advanced Features
- **🖱️ Drag & Drop**: Move nodes around the canvas with smooth interactions
- **🔍 Zoom & Pan**: Navigate large JSON structures with intuitive controls
- **📊 Status Bar**: Real-time document information and system status
- **⚙️ Preferences**: Customizable behavior and appearance settings
- **🎯 Context Menus**: Right-click actions for quick node operations
- **🌐 Responsive Design**: Works seamlessly across different screen sizes

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn package manager

### Development Mode

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Access the application:**
   Open [http://localhost:32767](http://localhost:32767) in your web browser

### Production Build

1. **Build for production:**
   ```bash
   npm run build
   ```

2. **Preview production build:**
   ```bash
   npm run preview
   ```

3. **Built files location:**
   The optimized application will be in the `./dist/` directory

## ⌨️ Keyboard Shortcuts

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Ctrl+O` | File → Open | Open a JSON file from your system |
| `Ctrl+S` | File → Save | Save the current document |
| `Ctrl+N` | File → New | Create a new blank document |
| `Ctrl+Z` | Edit → Undo | Undo the last action |
| `Ctrl+Y` | Edit → Redo | Redo a previously undone action |
| `Ctrl+L` | View → Auto Layout | Automatically arrange nodes |
| `Ctrl++` | View → Zoom In | Increase canvas zoom level |
| `Ctrl+-` | View → Zoom Out | Decrease canvas zoom level |
| `Ctrl+0` | View → Reset Zoom | Reset zoom to 100% |
| `Delete` | Edit → Delete | Remove selected node |
| `F2` | Edit → Rename | Edit selected node content |
| `Esc` | General | Cancel current operation |

## 📁 File Operations

### Opening Files
- **Menu Method**: File → Open (Ctrl+O)
- **Drag & Drop**: Drag a JSON file directly onto the canvas
- **File Dialog**: Use the system file picker to locate JSON files

### Saving Files
- **Quick Save**: File → Save (Ctrl+S) - Overwrites current file
- **Save As**: File → Save As - Save with new name/location
- **Export Options**: Save in different formats (compact, pretty-printed)

### Supported Formats
- **JSON (.json)**: Primary format with full validation
- **Pretty JSON**: Formatted with 2-space indentation
- **Compact JSON**: Minified for smaller file size

## 🎨 Themes

JSONIC Editor includes 5 professionally designed themes:

### Default Themes
- **Default Light**: Clean, professional light theme
- **Default Dark**: Easy-on-the-eyes dark theme

### Specialized Themes
- **Glassmorphic**: Modern frosted glass effect with transparency
- **Retro Terminal**: Classic terminal aesthetics with green text
- **Brutalist**: Bold, high-contrast design with heavy borders

### Switching Themes
1. **Menu Method**: View → Theme Selector
2. **Preferences**: Edit → Preferences → Appearance
3. **Keyboard**: Use theme switcher in preferences

## 🏗️ Architecture

### Frontend Stack
- **React 18**: Modern, component-based UI framework
- **TypeScript**: Full type safety and better developer experience
- **Styled Components**: CSS-in-JS styling with theme support
- **Zustand**: Lightweight state management with time-travel debugging
- **D3.js**: Powerful data visualization for canvas rendering

### State Management
- **Document Store**: JSON structure, node relationships, history
- **UI Store**: Theme preferences, viewport settings, modal states
- **Integration**: Seamless synchronization between stores

### Component Architecture
```
App
├── Navigation (menu bar, shortcuts)
├── Canvas (workspace, zoom/pan controls)
├── Node (individual JSON elements)
├── Modals (dialogs, preferences)
└── StatusBar (document info, system status)
```

## 🔧 Development

### Project Structure
```
jsonic-editor/
├── src/
│   ├── components/          # React components
│   │   ├── Navigation/     # Menu system
│   │   ├── Canvas/         # Workspace rendering
│   │   ├── Node/           # Individual JSON nodes
│   │   ├── Modals/         # Dialogs and preferences
│   │   └── StatusBar/      # Information display
│   ├── stores/            # State management
│   ├── utils/             # Utility functions
│   ├── types/             # TypeScript definitions
│   ├── themes/            # Theme configurations
│   ├── hooks/             # Custom React hooks
│   └── App.tsx            # Main application
├── docs/                  # Architecture documentation
├── dist/                  # Built application
├── package.json           # Dependencies and scripts
└── README.md             # This file
```

### Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run type-check   # TypeScript type checking
npm run lint         # Code linting (when configured)

# Testing
npm run test          # Run test suite (when implemented)
```

### Building from Source

1. **Ensure dependencies are installed:**
   ```bash
   npm install
   ```

2. **Build the application:**
   ```bash
   npm run build
   ```

3. **Verify the build:**
   Check the `./dist/` directory for built files

4. **Test locally:**
   ```bash
   npm run preview
   ```

## 📖 Usage Guide

### Getting Started

1. **Launch the application:**
   ```bash
   npm run dev
   ```

2. **Open a JSON file:**
   - Use File → Open or drag a file onto the canvas
   - The JSON will automatically convert to visual nodes

3. **Navigate the structure:**
   - Click nodes to select them
   - Use Tab to create child nodes
   - Use Shift+Tab to return to parent nodes
   - Use Ctrl+Arrow keys to navigate between siblings

4. **Edit content:**
   - Double-click a node to edit its value
   - Press Enter to save changes
   - Press Escape to cancel editing

### Working with Nodes

#### **Selection**
- **Single Select**: Click on any node
- **Multiple Select**: Ctrl+Click or Shift+Click to select multiple nodes
- **Deselect**: Click on empty canvas area or press Escape

#### **Editing**
- **Inline Edit**: Double-click a node to edit its content
- **Keyboard Edit**: Select a node and press F2
- **Confirm Changes**: Press Enter or click outside the node
- **Cancel Changes**: Press Escape

#### **Node Operations**
- **Create Child**: Select a node and press Tab
- **Delete Node**: Select and press Delete key
- **Move Node**: Drag to desired position on canvas
- **Expand/Collapse**: Click the +/- button on container nodes

### Canvas Navigation

#### **Zoom Controls**
- **Zoom In**: Ctrl++ or use zoom controls in bottom-right
- **Zoom Out**: Ctrl+- or use zoom controls
- **Reset Zoom**: Ctrl+0 or click reset button
- **Mouse Wheel**: Ctrl+scroll to zoom

#### **Pan Controls**
- **Pan Canvas**: Middle-click and drag, or Ctrl+drag
- **Reset Position**: Double-click zoom reset button

## 🐛 Troubleshooting

### Common Issues

#### **Build Errors**
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### **TypeScript Errors**
```bash
# Check types
npm run type-check

# Fix issues (address specific errors)
# Then build again
npm run build
```

#### **Port Already in Use**
```bash
# Kill process on port 32767
lsof -ti:32767 | xargs kill -9

# Or use different port
PORT=3000 npm run dev
```

#### **File Loading Issues**
- Ensure files are valid JSON format
- Check file permissions
- Verify file size (very large files may be slow)

### Performance Optimization

#### **Large JSON Files**
- Use collapse/expand to manage complexity
- Zoom out to see overall structure
- Use search functionality to find specific nodes

#### **Memory Usage**
- Close unused browser tabs
- Avoid keeping multiple large files open
- Restart browser periodically if needed

## 🔮 Future Roadmap

### Planned Features
- **Tauri 2 Desktop App**: Native desktop version with system integration
- **Advanced Search**: Find and replace functionality across nodes
- **Collaboration**: Real-time multi-user editing
- **Plugins**: Custom node types and visualization options
- **Import/Export**: Support for YAML, XML, and other formats
- **Validation**: JSON Schema validation with visual error indicators
- **Templates**: Predefined JSON structures for common use cases

### Technology Evolution
- **WebAssembly**: Performance-critical components in WASM
- **Progressive Web App**: Offline capabilities and app-like experience
- **Advanced Themes**: User-customizable theme creation
- **AI Integration**: Intelligent JSON structure suggestions

## 📄 License

Copyright (C) 2025 Robin L. M. Cheung, MBA

All rights reserved. This software may not be redistributed, modified, or used in derivative works without explicit written permission from the copyright holder.

## 🤝 Contributing

Currently accepting contributions for:
- Bug fixes and performance improvements
- Additional theme designs
- Documentation enhancements
- Test suite development

Please ensure all contributions follow the existing code style and architecture patterns.

## 📞 Support

For issues, questions, or feature requests:
1. Check the troubleshooting section above
2. Review the keyboard shortcuts and usage guide
3. Consult the architecture documentation
4. Create detailed bug reports with reproduction steps

---

**Built with ❤️ using React, TypeScript, and D3.js**

*Transforming JSON editing from a chore into an intuitive visual experience*