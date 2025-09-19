# Technical Specification: Tauri JSON Editor with Concept Map Visualization

## Architecture Overview

The application follows a client-server architecture where the Tauri backend (Rust) handles system-level operations and the frontend (React/TypeScript) manages the UI and visualization.

```
┌─────────────────────────────────────────────────────────────┐
│                    User Interface Layer                     │
│  ┌─────────────┐    ┌──────────────┐    ┌────────────────┐ │
│  │  Graph View │◄──►│ Text Editor  │◄──►│   Toolbar      │ │
│  └─────────────┘    └──────────────┘    └────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                   Application Logic Layer                   │
│  ┌─────────────┐    ┌──────────────┐    ┌────────────────┐ │
│  │ JSON Parser │    │ Graph Engine │    │ File Handler   │ │
│  │(comment-    │    │(Cytoscape.js)│    │                │ │
│  │  json)      │    │              │    │                │ │
│  └─────────────┘    └──────────────┘    └────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                    System Interface Layer                   │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                    Tauri Backend (Rust)               │ │
│  │  ┌─────────────┐    ┌──────────────┐    ┌───────────┐  │ │
│  │  │ File System │    │ IPC Handler  │    │ Clipboard │  │ │
│  │  └─────────────┘    └──────────────┘    └───────────┘  │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. Tauri Backend (Rust)

#### File Operations Module
```rust
// src-tauri/src/file_ops.rs
pub fn open_file() -> Result<String, String> { /* ... */ }
pub fn save_file(content: String, path: String) -> Result<(), String> { /* ... */ }
pub fn read_json_file(path: String) -> Result<JsonValue, String> { /* ... */ }
pub fn write_json_file(data: JsonValue, path: String) -> Result<(), String> { /* ... */ }
```

#### JSON Comment Handler
```rust
// src-tauri/src/json_comments.rs
pub fn parse_json_with_comments(json_str: String) -> Result<JsonValue, String> { /* ... */ }
pub fn stringify_json_with_comments(json_value: JsonValue) -> Result<String, String> { /* ... */ }
pub fn extract_comments(json_str: String) -> Result<CommentMap, String> { /* ... */ }
pub fn inject_comments(json_str: String, comments: CommentMap) -> Result<String, String> { /* ... */ }
```

### 2. Frontend Components (React/TypeScript)

#### JSON Data Model
```typescript
// src/types/jsonData.ts
interface JsonNode {
  id: string;
  type: 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null';
  key?: string;
  value?: any;
  children?: JsonNode[];
  parent?: string;
  position?: { x: number; y: number };
  comments?: string[];
}

interface JsonGraph {
  nodes: JsonNode[];
  edges: { source: string; target: string; type: 'parent' | 'sibling' }[];
  metadata: {
    comments: Record<string, string[]>;
    filePath?: string;
    lastModified?: Date;
  };
}
```

#### Graph Visualization Component
```typescript
// src/components/GraphView.tsx
interface GraphViewProps {
  graph: JsonGraph;
  onNodeSelect: (nodeId: string) => void;
  onNodeEdit: (nodeId: string, newValue: any) => void;
  onNodeCreate: (parentId: string, node: JsonNode) => void;
  onNodeDelete: (nodeId: string) => void;
  onNodeMove: (nodeId: string, newParentId: string) => void;
}

const GraphView: React.FC<GraphViewProps> = ({ 
  graph, 
  onNodeSelect, 
  onNodeEdit,
  onNodeCreate,
  onNodeDelete,
  onNodeMove 
}) => {
  // Implementation using Cytoscape.js
};
```

#### Text Editor Component
```typescript
// src/components/TextEditor.tsx
interface TextEditorProps {
  content: string;
  onChange: (content: string) => void;
  onSave: () => void;
  onOpen: () => void;
}

const TextEditor: React.FC<TextEditorProps> = ({ 
  content, 
  onChange, 
  onSave, 
  onOpen 
}) => {
  // Implementation using Monaco Editor
};
```

### 3. Core Utilities

#### JSON Parser with Comments
```typescript
// src/utils/jsonParser.ts
import commentJson from 'comment-json';

export const parseJsonWithComments = (jsonString: string): any => {
  return commentJson.parse(jsonString);
};

export const stringifyJsonWithComments = (jsonObject: any): string => {
  return commentJson.stringify(jsonObject, null, 2);
};

export const extractComments = (jsonString: string): CommentMap => {
  // Extract comments and associate them with JSON paths
};

export const injectComments = (jsonObject: any, comments: CommentMap): any => {
  // Inject comments back into JSON object
};
```

#### Graph Utilities
```typescript
// src/utils/graphUtils.ts
export const jsonToGraph = (jsonObject: any, path: string = ''): JsonGraph => {
  // Convert JSON object to graph representation
};

export const graphToJson = (graph: JsonGraph): any => {
  // Convert graph representation back to JSON object
};

export const findNode = (graph: JsonGraph, nodeId: string): JsonNode | undefined => {
  // Find node by ID
};

export const addChildNode = (graph: JsonGraph, parentId: string, node: JsonNode): JsonGraph => {
  // Add child node to parent
};

export const updateNode = (graph: JsonGraph, nodeId: string, updates: Partial<JsonNode>): JsonGraph => {
  // Update node properties
};
```

## Cytoscape.js Integration

### Node Styling
```javascript
// src/config/cytoscapeStyles.ts
const cytoscapeStyles = [
  {
    selector: 'node',
    style: {
      'background-color': '#666',
      'label': 'data(label)',
      'text-valign': 'center',
      'text-halign': 'center',
      'shape': 'round-rectangle',
      'width': 'label',
      'height': 'label',
      'padding': '10px',
      'font-size': '14px',
      'color': '#fff',
      'text-outline-width': 2,
      'text-outline-color': '#666'
    }
  },
  {
    selector: 'node[type = "object"]',
    style: {
      'background-color': '#4a90e2'
    }
  },
  {
    selector: 'node[type = "array"]',
    style: {
      'background-color': '#7ed321'
    }
  },
  {
    selector: 'node[type = "primitive"]',
    style: {
      'background-color': '#f5a623',
      'shape': 'ellipse'
    }
  },
  {
    selector: 'edge',
    style: {
      'width': 2,
      'line-color': '#ccc',
      'target-arrow-color': '#ccc',
      'target-arrow-shape': 'triangle',
      'curve-style': 'bezier'
    }
  },
  {
    selector: 'node:selected',
    style: {
      'border-width': 2,
      'border-color': '#fff'
    }
  }
];
```

### Layout Configuration
```javascript
// src/config/cytoscapeLayouts.ts
const layouts = {
  breadthfirst: {
    name: 'breadthfirst',
    directed: true,
    padding: 10,
    spacingFactor: 1.5,
    avoidOverlap: true,
    nodeDimensionsIncludeLabels: true
  },
  cose: {
    name: 'cose',
    animate: true,
    animationDuration: 1000,
    fit: true,
    padding: 30,
    avoidOverlap: true,
    nodeDimensionsIncludeLabels: true
  },
  fcose: {
    name: 'fcose',
    animate: true,
    animationDuration: 1000,
    fit: true,
    padding: 30,
    avoidOverlap: true,
    nodeDimensionsIncludeLabels: true
  }
};
```

## Keyboard Navigation Implementation

```typescript
// src/hooks/useKeyboardNavigation.ts
import { useEffect } from 'react';

interface KeyboardNavigationOptions {
  currentNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
  onCreateChild: (parentId: string) => void;
  onCreateSibling: (siblingId: string) => void;
  onReturnToParent: (childId: string) => void;
  graph: JsonGraph;
}

export const useKeyboardNavigation = ({
  currentNodeId,
  onSelectNode,
  onCreateChild,
  onCreateSibling,
  onReturnToParent,
  graph
}: KeyboardNavigationOptions) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!currentNodeId) return;

      // Prevent default behavior for our shortcuts
      if (['Tab', 'Enter', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        event.preventDefault();
      }

      switch (event.key) {
        case 'Tab':
          if (event.shiftKey) {
            // SHIFT-TAB: Return to parent
            onReturnToParent(currentNodeId);
          } else {
            // TAB: Create child
            onCreateChild(currentNodeId);
          }
          break;
        case 'Enter':
          // ENTER: Create sibling
          onCreateSibling(currentNodeId);
          break;
        case 'ArrowUp':
          // CTRL-ARROW: Navigate to previous sibling
          if (event.ctrlKey) {
            // Implementation for navigating to previous sibling
          }
          break;
        case 'ArrowDown':
          // CTRL-ARROW: Navigate to next sibling
          if (event.ctrlKey) {
            // Implementation for navigating to next sibling
          }
          break;
        case 'ArrowLeft':
          // CTRL-ARROW: Navigate to parent
          if (event.ctrlKey) {
            onReturnToParent(currentNodeId);
          }
          break;
        case 'ArrowRight':
          // CTRL-ARROW: Navigate to first child
          if (event.ctrlKey) {
            // Implementation for navigating to first child
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentNodeId, onSelectNode, onCreateChild, onCreateSibling, onReturnToParent, graph]);
};
```

## Comment Handling Strategy

### Approach 1: Metadata Storage
Store comments in a separate metadata structure that maps JSON paths to comments:

```typescript
// Example comment metadata structure
interface CommentMetadata {
  '/users/0/name': ['// User\'s full name'],
  '/users/0/age': ['// Age in years'],
  '/settings': ['// Application configuration options', '// Last updated: 2023-01-01']
}

// When saving, we would:
// 1. Convert graph back to JSON
// 2. Inject comments from metadata
// 3. Save to file
```

### Approach 2: Separate Comment File
Store comments in a separate `.jsonc` or `.comments` file alongside the JSON file:

```typescript
// For file.json, we would also have file.json.comments
// file.json.comments content:
{
  "comments": {
    "/users/0/name": ["// User's full name"],
    "/users/0/age": ["// Age in years"],
    "/settings": ["// Application configuration options", "// Last updated: 2023-01-01"]
  }
}
```

## Data Flow

1. **File Open**:
   ```
   User → Tauri Backend → File System → JSON String → 
   Comment Parser → JSON Object → Graph Converter → 
   Cytoscape.js Graph → UI
   ```

2. **Node Edit**:
   ```
   User → Graph UI → Node Update → Graph → 
   JSON Converter → Comment Injector → 
   Tauri Backend → File System
   ```

3. **File Save**:
   ```
   User → Save Command → Graph → JSON Converter → 
   Comment Injector → Tauri Backend → File System
   ```

## Performance Considerations

### Virtualization
For large JSON files, implement virtualization to only render visible nodes:

```typescript
// src/hooks/useGraphVirtualization.ts
interface VirtualizationOptions {
  viewport: { width: number; height: number };
  zoom: number;
  pan: { x: number; y: number };
}

export const useGraphVirtualization = ({
  nodes,
  edges,
  viewport,
  zoom,
  pan
}: VirtualizationOptions) => {
  // Calculate which nodes are in the viewport
  // Only render those nodes and their immediate connections
};
```

### Debouncing Updates
Debounce frequent updates to prevent performance issues:

```typescript
// src/hooks/useDebouncedUpdate.ts
import { useEffect, useState } from 'react';
import debounce from 'lodash.debounce';

export const useDebouncedUpdate = <T>(
  value: T,
  delay: number,
  callback: (value: T) => void
) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
      callback(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay, callback]);

  return debouncedValue;
};
```

## Error Handling

### JSON Parsing Errors
```typescript
// src/utils/errorHandler.ts
export const handleJsonParseError = (error: any): string => {
  if (error.message.includes('Unexpected token')) {
    return 'Invalid JSON format: Unexpected character';
  }
  if (error.message.includes('Unexpected end of JSON')) {
    return 'Invalid JSON format: Incomplete JSON';
  }
  return `JSON parsing error: ${error.message}`;
};
```

### File Operation Errors
```typescript
// src/utils/fileErrorHandler.ts
export const handleFileError = (error: any): string => {
  if (error.code === 'ENOENT') {
    return 'File not found';
  }
  if (error.code === 'EACCES') {
    return 'Permission denied';
  }
  if (error.code === 'ENOSPC') {
    return 'Not enough disk space';
  }
  return `File operation error: ${error.message}`;
};
```

## Testing Strategy

### Unit Tests
```typescript
// src/__tests__/jsonParser.test.ts
describe('JSON Parser with Comments', () => {
  test('parses JSON with line comments', () => {
    const json = `{
      // User information
      "name": "John Doe",
      "age": 30 // Age in years
    }`;
    
    const result = parseJsonWithComments(json);
    expect(result.name).toBe('John Doe');
    expect(result.age).toBe(30);
  });
  
  test('converts JSON to graph correctly', () => {
    const json = { users: [{ name: 'John' }] };
    const graph = jsonToGraph(json);
    
    expect(graph.nodes.length).toBe(3);
    expect(graph.edges.length).toBe(2);
  });
});
```

### Integration Tests
```typescript
// src/__tests__/fileOperations.test.ts
describe('File Operations', () => {
  test('opens and parses JSON file correctly', async () => {
    const mockFileContent = '{"name": "test"}';
    // Mock Tauri file system API
    // Test the complete flow from file open to graph display
  });
});
```

## Security Considerations

1. **File System Access**: Only allow access to user-selected files
2. **JSON Sanitization**: Validate and sanitize JSON before parsing
3. **Memory Management**: Implement proper cleanup for large files
4. **Cross-Platform Compatibility**: Ensure consistent behavior across platforms

## Accessibility

1. **Keyboard Navigation**: Full keyboard control of all features
2. **Screen Reader Support**: Proper ARIA labels for graph elements
3. **Color Contrast**: Ensure sufficient contrast for all UI elements
4. **Focus Management**: Clear focus indicators for interactive elements

This technical specification provides a comprehensive overview of the implementation approach for the Tauri JSON Editor with Concept Map Visualization.