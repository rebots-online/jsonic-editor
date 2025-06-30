import { useEffect } from 'react';
import { ShortcutManager } from '../utils/keyboard/shortcut-manager';

export function useKeyboard(manager: ShortcutManager) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => manager.handleKeyDown(e);
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [manager]);
}
