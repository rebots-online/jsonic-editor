import React from 'react';
import './navigation.css';

interface Props {
  onFileOpen: () => void;
  onFileSave: () => void;
  onPreferencesOpen: () => void;
}

export function NavigationBar({ onFileOpen, onFileSave, onPreferencesOpen }: Props) {
  return (
    <nav className="navigation-bar">
      <div className="nav-section">
        <h1 className="app-title">JSONIC Editor</h1>
      </div>

      <div className="nav-section">
        <div className="nav-group">
          <button
            className="nav-button"
            onClick={onFileOpen}
            title="Open JSON file (Ctrl+O)"
          >
            📁 Open
          </button>
          <button
            className="nav-button"
            onClick={onFileSave}
            title="Save JSON file (Ctrl+S)"
          >
            💾 Save
          </button>
        </div>

        <div className="nav-group">
          <button
            className="nav-button"
            onClick={onPreferencesOpen}
            title="Preferences"
          >
            ⚙️ Preferences
          </button>
        </div>
      </div>
    </nav>
  );
}