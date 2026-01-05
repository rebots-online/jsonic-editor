import React, { useCallback, useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import Toolbar from './components/Toolbar';
import GraphView from './components/GraphView';
import TextEditor from './components/TextEditor';
import StatusBar from './components/StatusBar';
import { JsonGraph } from './types/jsonTypes';
import { 
  addChildNode, 
  findNode, 
  graphToJson, 
  jsonToGraph, 
  moveNode, 
  removeNode, 
  updateNode 
} from './utils/jsonParser';

type StatusLevel = 'info' | 'error';
interface StatusMessage {
  level: StatusLevel;
  message: string;
}

const createEmptyGraph = (): JsonGraph => ({
  nodes: [],
  edges: [],
  metadata: { comments: {} }
});

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'graph' | 'text' | 'split'>('graph');
  const [graph, setGraph] = useState<JsonGraph>(createEmptyGraph);
  const [textContent, setTextContent] = useState<string>('');
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  const [status, setStatus] = useState<StatusMessage | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const syncGraphAndText = useCallback((jsonValue: any) => {
    setGraph(jsonToGraph(jsonValue));
    setTextContent(JSON.stringify(jsonValue, null, 2));
  }, []);

  const handleOpenFile = useCallback(async () => {
    try {
      const result = await invoke<any>('cmd_open_file');
      syncGraphAndText(result);

      const returnedPath =
        (result as any)?.metadata?.filePath ??
        (result as any)?.filePath ??
        currentFile;

      if (typeof returnedPath === 'string') {
        setCurrentFile(returnedPath);
      }

      setStatus({ level: 'info', message: 'File opened successfully.' });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setStatus({ level: 'error', message: `Open failed: ${message}` });
    }
  }, [currentFile, syncGraphAndText]);

  const handleSaveFile = useCallback(async () => {
    let contentValue: any;

    if (textContent.trim().length > 0) {
      try {
        contentValue = JSON.parse(textContent);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        setStatus({ level: 'error', message: `Save aborted: invalid JSON - ${message}` });
        return;
      }
    } else {
      contentValue = graphToJson(graph);
    }

    try {
      await invoke('cmd_save_file', {
        path: currentFile ?? undefined,
        content: contentValue
      });
      setStatus({
        level: 'info',
        message: `Saved ${currentFile ?? 'file'}.`
      });
      syncGraphAndText(contentValue);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setStatus({ level: 'error', message: `Save failed: ${message}` });
    }
  }, [currentFile, graph, syncGraphAndText, textContent]);

  const handleNewFile = useCallback(() => {
    setGraph(createEmptyGraph());
    setTextContent('');
    setCurrentFile(null);
    setStatus({ level: 'info', message: 'New file started.' });
  }, []);

  const updateGraphState = useCallback((updater: (current: JsonGraph) => JsonGraph) => {
    setGraph(current => {
      const nextGraph = updater(current);
      setTextContent(JSON.stringify(graphToJson(nextGraph), null, 2));
      return nextGraph;
    });
  }, []);

  const handleNodeSelect = useCallback((payload: { id: string; type?: string; key?: string; value?: any; position?: { x: number; y: number }; parentId?: string }) => {
    setSelectedNodeId(payload.id);
  }, []);

  const handleNodeEdit = useCallback((payload: {
    id: string;
    key?: string;
    type: string;
    value?: any;
    parentId?: string;
  }) => {
    const currentValue = payload.value !== undefined ? JSON.stringify(payload.value) : '';
    const nextValueRaw = window.prompt('Update value (leave blank to keep current). For objects/arrays, enter JSON.', currentValue);
    if (nextValueRaw === null) return;

    let nextValue: any = payload.value;
    try {
      nextValue = nextValueRaw.trim().length ? JSON.parse(nextValueRaw) : nextValue;
    } catch {
      nextValue = nextValueRaw;
    }

    updateGraphState(current => updateNode(current, payload.id, { value: nextValue }));
  }, [updateGraphState]);

  const handleNodeCreate = useCallback((payload: { parentId: string; position?: { x: number; y: number } }) => {
    updateGraphState(current => {
      const parent = findNode(current, payload.parentId);
      if (!parent) return current;

      const defaultKey = parent.type === 'array' ? String(parent.children?.length ?? 0) : 'newKey';
      const key = parent.type === 'object'
        ? window.prompt('Enter property name for new child', defaultKey) ?? defaultKey
        : defaultKey;

      const valueInput = window.prompt('Initial value (leave blank for object)', '');
      let newType: JsonGraph['nodes'][number]['type'] = 'object';
      let newValue: any = undefined;

      if (valueInput && valueInput.trim().length) {
        try {
          newValue = JSON.parse(valueInput);
          if (newValue === null) {
            newType = 'null';
          } else if (Array.isArray(newValue)) {
            newType = 'array';
          } else if (typeof newValue === 'object') {
            newType = 'object';
          } else if (typeof newValue === 'string') {
            newType = 'string';
          } else if (typeof newValue === 'number') {
            newType = 'number';
          } else if (typeof newValue === 'boolean') {
            newType = 'boolean';
          }
        } catch {
          newType = 'string';
          newValue = valueInput;
        }
      }

      const newNode = {
        key,
        type: newType,
        value: ['object', 'array'].includes(newType) ? undefined : newValue,
        children: ['object', 'array'].includes(newType) ? [] : undefined,
        position: payload.position
      } as Omit<JsonGraph['nodes'][number], 'id' | 'parent'>;

      return addChildNode(current, payload.parentId, newNode);
    });
  }, [updateGraphState]);

  const handleNodeDelete = useCallback((payload: { id: string }) => {
    updateGraphState(current => removeNode(current, payload.id));
  }, [updateGraphState]);

  const handleNodeMove = useCallback((payload: { id: string; newParentId: string; position?: { x: number; y: number } }) => {
    updateGraphState(current => moveNode(current, payload.id, payload.newParentId, payload.position));
  }, [updateGraphState]);

  const handleViewportPositions = useCallback((positions: Record<string, { x: number; y: number }>) => {
    setGraph(current => ({
      ...current,
      nodes: current.nodes.map(node => positions[node.id] ? { ...node, position: positions[node.id] } : node)
    }));
  }, []);

  return (
    <div className="app">
      <Toolbar 
        onOpen={handleOpenFile}
        onSave={handleSaveFile}
        onNew={handleNewFile}
        onViewChange={setCurrentView}
        currentView={currentView}
      />
      
      <div className="main-content">
        {currentView === 'graph' && (
          <GraphView 
            graph={graph}
            onNodeSelect={handleNodeSelect}
            onNodeEdit={handleNodeEdit}
            onNodeCreate={handleNodeCreate}
            onNodeDelete={handleNodeDelete}
            onNodeMove={handleNodeMove}
            onPositionsUpdate={handleViewportPositions}
          />
        )}
        
        {currentView === 'text' && (
          <TextEditor 
            content={textContent}
            onChange={setTextContent}
            onSave={handleSaveFile}
            onOpen={handleOpenFile}
          />
        )}
        
        {currentView === 'split' && (
          <div className="split-view">
            <div className="split-left">
              <GraphView 
                graph={graph}
                onNodeSelect={handleNodeSelect}
                onNodeEdit={handleNodeEdit}
                onNodeCreate={handleNodeCreate}
                onNodeDelete={handleNodeDelete}
                onNodeMove={handleNodeMove}
                onPositionsUpdate={handleViewportPositions}
              />
            </div>
            <div className="split-right">
              <TextEditor 
                content={textContent}
                onChange={setTextContent}
                onSave={handleSaveFile}
                onOpen={handleOpenFile}
              />
            </div>
          </div>
        )}
      </div>
      
      <StatusBar 
        currentFile={currentFile}
        nodeCount={graph.nodes.length}
        edgeCount={graph.edges.length}
        status={status}
      />
    </div>
  );
};

export default App;
