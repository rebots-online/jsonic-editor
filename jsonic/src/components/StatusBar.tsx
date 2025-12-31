import React from 'react';

interface StatusBarProps {
  currentFile: string | null;
  nodeCount: number;
  edgeCount: number;
  status?: {
    level: 'info' | 'error';
    message: string;
  } | null;
}

const StatusBar: React.FC<StatusBarProps> = ({ 
  currentFile, 
  nodeCount, 
  edgeCount,
  status
}) => {
  return (
    <div className="status-bar">
      <div className="status-left">
        {currentFile ? `File: ${currentFile}` : 'No file open'}
      </div>
      <div className="status-center">
        {status && (
          <span className={`status-message ${status.level}`}>
            {status.level === 'error' ? 'Error: ' : ''}
            {status.message}
          </span>
        )}
      </div>
      <div className="status-right">
        Nodes: {nodeCount} | Edges: {edgeCount}
      </div>
    </div>
  );
};

export default StatusBar;
