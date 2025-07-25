import React from 'react';

interface StatusBarProps {
  currentFile: string | null;
  nodeCount: number;
  edgeCount: number;
}

const StatusBar: React.FC<StatusBarProps> = ({ 
  currentFile, 
  nodeCount, 
  edgeCount 
}) => {
  return (
    <div className="status-bar">
      <div className="status-left">
        {currentFile ? `File: ${currentFile}` : 'No file open'}
      </div>
      <div className="status-right">
        Nodes: {nodeCount} | Edges: {edgeCount}
      </div>
    </div>
  );
};

export default StatusBar;