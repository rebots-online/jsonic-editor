import React from 'react';

interface ToolbarProps {
  onOpen: () => void;
  onSave: () => void;
  onNew: () => void;
  onViewChange: (view: 'graph' | 'text' | 'split') => void;
  currentView: 'graph' | 'text' | 'split';
}

const Toolbar: React.FC<ToolbarProps> = ({ 
  onOpen, 
  onSave, 
  onNew,
  onViewChange,
  currentView
}) => {
  return (
    <div className="toolbar">
      <div className="toolbar-group">
        <button className="toolbar-button" onClick={onNew}>
          New
        </button>
        <button className="toolbar-button" onClick={onOpen}>
          Open
        </button>
        <button className="toolbar-button" onClick={onSave}>
          Save
        </button>
      </div>
      
      <div className="view-toggle">
        <button 
          className={`toolbar-button ${currentView === 'graph' ? 'active' : ''}`}
          onClick={() => onViewChange('graph')}
        >
          Graph View
        </button>
        <button 
          className={`toolbar-button ${currentView === 'text' ? 'active' : ''}`}
          onClick={() => onViewChange('text')}
        >
          Text View
        </button>
        <button 
          className={`toolbar-button ${currentView === 'split' ? 'active' : ''}`}
          onClick={() => onViewChange('split')}
        >
          Split View
        </button>
      </div>
    </div>
  );
};

export default Toolbar;