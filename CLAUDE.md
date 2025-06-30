# CLAUDE.md - jsonic-editor Project Guide

## Project Overview
**jsonic-editor** is a web-based application that provides a visual, concept-map-like interface for editing JSON files. Instead of traditional nested brackets, JSON content is displayed as "thought bubble" shapes to prevent bracket-matching errors and improve readability.

**Author**: Robin L. M. Cheung, MBA  
**License**: Apache License 2.0  
**Status**: Early conceptual/planning stage - no implementation code yet  

## Project Purpose
The application aims to solve the common problem of mismatched brackets in JSON editing by presenting JSON structure as a visual concept map where:
- JSON objects/arrays are represented as "thought bubbles"
- Hierarchical relationships are visually clear
- Users can navigate using keyboard shortcuts (Tab, Shift+Tab, Ctrl+Arrow keys)
- File operations support standard JSON import/export

## Current Project State
This project is currently in the **planning and documentation phase**:
- ✅ Architecture documentation exists (`docs/architecture.mmd`)
- ✅ README with user interaction specifications
- ✅ Apache 2.0 license configured
- ✅ Git repository initialized
- ❌ No source code implementation yet
- ❌ No build system or package.json
- ❌ No technology stack chosen

## Architecture Overview
Based on the detailed architecture documentation in `/home/robin/CascadeProjects/jsonic-editor/docs/architecture.mmd`, the planned system follows a layered architecture:

### Core Components
1. **User Interface Layer**
   - Navigation Bar (file operations, preferences)
   - Editor Canvas (main workspace)
   - Node Components (visual JSON elements)
   - Context Menus (right-click actions)
   - Modal Windows (dialogs, preferences)

2. **State Management**
   - Application State (global state)
   - Document State (JSON structure)
   - UI State (active nodes, selections)
   - User Preferences (persisted settings)

3. **Core Logic**
   - Parser/Serializer (JSON ↔ internal format)
   - Schema Validator (JSON validation)
   - Undo/Redo Manager (change tracking)
   - File I/O Handler (file operations)

4. **Utilities**
   - Keyboard Shortcuts (navigation system)
   - Theme Manager (styling)
   - Logging (centralized logging)
   - Error Handler (error management)

## Key Features (Planned)
- **Visual JSON Editing**: Bubble-based representation instead of text brackets
- **Keyboard Navigation**: 
  - Tab: Create child node
  - Shift+Tab: Return to parent
  - Ctrl+Arrow: Navigate siblings
- **File Operations**: Open/Save JSON files (Ctrl+O, Ctrl+S)
- **Preferences System**: Theme settings, editor behavior
- **Undo/Redo**: Full action history tracking
- **Context Menus**: Node-specific actions
- **Responsive Design**: Multiple screen sizes
- **Accessibility**: Screen reader support

## Technology Stack (To Be Determined)
The architecture suggests modern web technologies:
- Frontend Framework: React or Vue.js (mentioned in docs)
- Language: TypeScript (indicated by .gitignore)
- Build System: Node.js-based (indicated by .gitignore)
- Styling: CSS-in-JS or similar
- State Management: Context API, Redux, or Vuex

## File Structure
```
/home/robin/CascadeProjects/jsonic-editor/
├── docs/
│   ├── architecture.mmd           # Detailed architecture diagrams
│   ├── architecture-clean.mmd     # Simplified architecture
│   ├── minimal-test.mmd          # Test Mermaid diagram
│   └── test-subgraph.mmd         # Test subgraph diagram
├── README.md                     # User-facing documentation
├── LICENSE                       # Apache 2.0 license
├── .gitignore                    # Node.js gitignore template
└── CLAUDE.md                     # This file
```

## Getting Started for Development

### Current Status
Since no implementation exists yet, the first steps would be:

1. **Choose Technology Stack**
   - Select frontend framework (React/Vue)
   - Choose build tool (Vite, Webpack, etc.)
   - Set up TypeScript configuration

2. **Initialize Project Structure**
   - Create package.json with dependencies
   - Set up build scripts and dev server
   - Create src/ directory structure

3. **Implement Core Components**
   - Start with basic UI layout
   - Implement JSON parser/serializer
   - Create node rendering system

### Recommended Development Approach
1. **Phase 1**: Basic JSON parsing and bubble rendering
2. **Phase 2**: Keyboard navigation and node interaction
3. **Phase 3**: File I/O operations
4. **Phase 4**: Preferences and theming
5. **Phase 5**: Advanced features (undo/redo, validation)

## Architecture Patterns
- **Component-Based**: Modular UI components
- **State Management**: Centralized state with clear data flow
- **Separation of Concerns**: UI, logic, and utilities are distinct
- **Event-Driven**: User interactions drive state changes
- **Layered Architecture**: Clear boundaries between layers

## Key Challenges to Address
1. **Performance**: Rendering large JSON files efficiently
2. **UX Design**: Intuitive visual representation of JSON structure
3. **Accessibility**: Screen reader support for visual interface
4. **File Handling**: Browser-based file system interaction
5. **State Synchronization**: Keeping visual representation in sync with JSON data

## Contributing Guidelines
- Follow the architectural patterns outlined in docs/
- Maintain separation between UI, state, and core logic
- Implement comprehensive keyboard navigation
- Ensure accessibility compliance
- Add tests for all core functionality

## References
- Main architecture: `/home/robin/CascadeProjects/jsonic-editor/docs/architecture.mmd`
- User guide: `/home/robin/CascadeProjects/jsonic-editor/README.md`
- License: `/home/robin/CascadeProjects/jsonic-editor/LICENSE`

## CODING PRINCIPLES
PLANNING AND ARCHITECTING, THEN CODING ACCORDING TO CHECKLIST
Architecture --> Checklist --> Code

"NEVER use placeholder data or functions; do not begin coding until the entire codebase has been
elucidated and turned into a CHECKLIST-<theme-of-effort -tasks="">-.md; if you need to
rearchitect any portion of the implementation, do so and produce a new set of checklists to match, then
begin coding, again only when every step has been planned into an execution checklist. There should
never be any mock functionality or placeholders in any project, so if you ever encounter any, we MUST
address it, whether urgently or deferred."

"When generating a checklist, it should be a detailed checklist file that precisely matches the planned architecture, specifying functions down to their usage level, exact filenames involved, and required libraries & which functions from the libraries are to be used. This checklist must be clear enough for any coder or coding agent to independently produce the same code or work simultaneously on separate components of the codebase."

"Always TEST functionality before ending coding session and do not report completion until the test
functions according to specification."
"Upon completing a task, always ensure the architecture representation in UML/Mermaid under
docs/architecture/ is up-to-date, reflecting the actual codebase reality and in Neo4j reflecting the
actual relationships between the constituent components."

If you need to change an approach during the build, return to the architecting phase and do not begin building until you have architected to a complete codebase again
Document the new architecture, highlighting the modifcations, accompanied with an explanatory narrative
-> reflected in neo4j graph and hKG, this is our richest source of key learnings that compound our growth through experience

Hybrid Knowledge Graph (hKG)

Every state change and plan/task info is stored across:

Vector semantic store (Qdrant)
Relational graph (Neo4j)

store components of the architecture in neo4j explicitly by their ontological relationships to each other, as in an ERD
Raw logs (PostgreSQL)

Generate a time-ordered UUIDv8 (ancestry-encoded) common to all three orthogonal representations of the same construct

Checklist States

[ ] — Not started
[/] — In progress
[x] — Done but untested
✅ — Fully tested and complete

Tool Usage Guidelines
Always probe project files using commands like read_file, list_files, or search_files before assuming content.

Avoid assumptions about codebase state; always verify reality:

NEVER USE PLACEHOLDERS or MOCK FUNCTIONS
---
*This document was generated by Claude Code to help future instances understand the jsonic-editor project structure and architecture.*
