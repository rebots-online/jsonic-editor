import React from 'react';

interface Props {
  onFileOpen: () => void;
  onFileSave: () => void;
  onPreferencesOpen: () => void;
}

export function NavigationBar({ onFileOpen, onFileSave, onPreferencesOpen }: Props) {
  return (
    <nav>
      <button onClick={onFileOpen}>Open</button>
      <button onClick={onFileSave}>Save</button>
      <button onClick={onPreferencesOpen}>Preferences</button>
    </nav>
  );
}
