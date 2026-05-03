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
  const version = 'v0.1.0';
  const build = String(Math.floor(Date.now() / 60000) % 100000).padStart(5, '0');
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
        Nodes: {nodeCount} | Edges: {edgeCount} | {version}+{build}
      </div>
    </div>
  );
};

export default StatusBar;
