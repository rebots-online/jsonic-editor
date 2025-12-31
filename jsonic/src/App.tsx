import React, { useCallback, useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import Toolbar from './components/Toolbar';
import GraphView from './components/GraphView';
import TextEditor from './components/TextEditor';
import StatusBar from './components/StatusBar';
import { JsonGraph } from './types/jsonTypes';
import { graphToJson, jsonToGraph } from './utils/jsonParser';

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
            onNodeSelect={(nodeId) => console.log('Selected node:', nodeId)}
            onNodeEdit={(nodeId, value) => console.log('Edited node:', nodeId, value)}
            onNodeCreate={(parentId, node) => console.log('Created node:', parentId, node)}
            onNodeDelete={(nodeId) => console.log('Deleted node:', nodeId)}
            onNodeMove={(nodeId, newParentId) => console.log('Moved node:', nodeId, newParentId)}
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
                onNodeSelect={(nodeId) => console.log('Selected node:', nodeId)}
                onNodeEdit={(nodeId, value) => console.log('Edited node:', nodeId, value)}
                onNodeCreate={(parentId, node) => console.log('Created node:', parentId, node)}
                onNodeDelete={(nodeId) => console.log('Deleted node:', nodeId)}
                onNodeMove={(nodeId, newParentId) => console.log('Moved node:', nodeId, newParentId)}
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
