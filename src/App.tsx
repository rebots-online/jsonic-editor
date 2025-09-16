import React, { useState, useCallback, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { NavigationBar } from './components/navigation/navigation-bar';
import { JsonNode, NodeType, AppState } from './types/core';
import { FileHandler } from './core/file-io/file-handler';
import { JsonParser } from './core/parser/json-parser';
import { SpatialCanvas } from './components/canvas/spatial-canvas';
import './App-canvas.css';

interface JsonNodeWithPosition extends JsonNode {
  position: { x: number; y: number };
}

const fileHandler = new FileHandler();
const parser = new JsonParser();

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({
    document: {
      nodes: [],
    },
    ui: {
      activeNode: null,
      selectedNodes: [],
    },
    preferences: {
      theme: 'light',
      shortcuts: {},
    },
  });

  
  const handleFileOpen = useCallback(async () => {
    try {
      const { nodes: parsed } = await fileHandler.openDocument();

      setAppState(prev => ({
        ...prev,
        document: {
          nodes: parsed,
        },
      }));
    } catch (err) {
      console.error('Failed to open file:', err);
    }
  }, []);

  const handleFileSave = useCallback(() => {
    try {
      const json = parser.serialize(appState.document.nodes);
      fileHandler.saveFile(json, 'data.json');
    } catch (err) {
      console.error('Failed to save file:', err);
    }
  }, [appState.document.nodes]);

  const handlePreferencesOpen = useCallback(() => {
    console.log('Open preferences');
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'o':
            e.preventDefault();
            handleFileOpen();
            break;
          case 's':
            e.preventDefault();
            handleFileSave();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFileOpen, handleFileSave]);

  const handleNodeSelect = useCallback((nodeId: string, e?: React.MouseEvent | React.KeyboardEvent) => {
    setAppState(prev => ({
      ...prev,
      ui: {
        ...prev.ui,
        activeNode: nodeId,
        selectedNodes: e && (e.shiftKey || e.ctrlKey || e.metaKey)
          ? prev.ui.selectedNodes.includes(nodeId)
            ? prev.ui.selectedNodes.filter(id => id !== nodeId)
            : [...prev.ui.selectedNodes, nodeId]
          : [nodeId],
      },
    }));
  }, []);

  const handleNodeUpdate = useCallback((nodeId: string, updates: Partial<JsonNode>) => {
    setAppState(prev => ({
      ...prev,
      document: {
        nodes: prev.document.nodes.map(node =>
          node.id === nodeId ? { ...node, ...updates } : node
        ),
      },
    }));
  }, []);

  const handleNodeDrop = useCallback((draggedId: string, parentId: string, index: number) => {
    console.log('Drop:', draggedId, parentId, index);
  }, []);

  const handleToggleExpand = useCallback((nodeId: string) => {
    setAppState(prev => ({
      ...prev,
      document: {
        nodes: prev.document.nodes.map(node =>
          node.id === nodeId ? { ...node, expanded: !node.expanded } : node
        ),
      },
    }));
  }, []);

  const handleAddChild = useCallback((parentId: string, type: NodeType, index?: number) => {
    console.log('Add child:', parentId, type, index);
  }, []);

  const handleContextMenu = useCallback((e: React.MouseEvent, node: JsonNode) => {
    e.preventDefault();
    console.log('Context menu:', node);
  }, []);

  return (
    <div className="app">
      <DndProvider backend={HTML5Backend}>
        <NavigationBar
          onFileOpen={handleFileOpen}
          onFileSave={handleFileSave}
          onPreferencesOpen={handlePreferencesOpen}
        />
        <main className="app-main">
          {appState.document.nodes.length === 0 ? (
            <div className="empty-state">
              <h2>Welcome to JSONIC Editor</h2>
              <p>Open a JSON file to start editing, or create a new one.</p>
              <button onClick={handleFileOpen}>Open JSON File</button>
            </div>
          ) : (
            <SpatialCanvas
              nodes={appState.document.nodes}
              onNodeSelect={handleNodeSelect}
              onNodeUpdate={handleNodeUpdate}
              onNodeDrop={handleNodeDrop}
              onToggleExpand={handleToggleExpand}
              onAddChild={handleAddChild}
              onContextMenu={handleContextMenu}
              selectedNodes={appState.ui.selectedNodes}
            />
          )}
        </main>
      </DndProvider>
    </div>
  );
};

export default App;