import React from 'react';
import { UserPreferences } from '../../types/core';
import { ModalBase } from './modal-base';

interface Props {
  preferences: UserPreferences;
  onSave: (prefs: UserPreferences) => void;
  onCancel: () => void;
}

export function PreferencesModal({ preferences, onSave, onCancel }: Props) {
  const [theme, setTheme] = React.useState(preferences.theme);

  const handleSave = () => {
    onSave({ ...preferences, theme });
  };

  return (
    <ModalBase isOpen={true} onClose={onCancel} title="Preferences">
      <label>
        Theme
        <input value={theme} onChange={e => setTheme(e.target.value)} />
      </label>
      <button onClick={handleSave}>Save</button>
      <button onClick={onCancel}>Cancel</button>
    </ModalBase>
  );
}
