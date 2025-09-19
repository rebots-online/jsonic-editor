import React, { useState } from 'react';
import Toolbar from './components/Toolbar';
import GraphView from './components/GraphView';
import TextEditor from './components/TextEditor';
import StatusBar from './components/StatusBar';
import { JsonGraph } from './types/jsonTypes';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'graph' | 'text' | 'split'>('graph');
  const [graph, setGraph] = useState<JsonGraph>({
    nodes: [],
    edges: [],
    metadata: { comments: {} }
  });
  const [textContent, setTextContent] = useState<string>('');
  const [currentFile, setCurrentFile] = useState<string | null>(null);

  const handleOpenFile = () => {
    // Implementation for opening file
  };

  const handleSaveFile = () => {
    // Implementation for saving file
  };

  const handleNewFile = () => {
    // Implementation for creating new file
  };

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
      />
    </div>
  );
};

export default App;