export type ShortcutCallback = () => void;

export class ShortcutManager {
  private shortcuts = new Map<string, ShortcutCallback>();

  registerShortcut(keys: string, callback: ShortcutCallback): void {
    this.shortcuts.set(keys, callback);
  }

  unregisterShortcut(keys: string): void {
    this.shortcuts.delete(keys);
  }

  handleKeyDown(event: KeyboardEvent): void {
    const combo = this.parseKeyCombo(event);
    const cb = this.shortcuts.get(combo);
    if (cb) cb();
  }

  parseKeyCombo(event: KeyboardEvent): string {
    let combo = '';
    if (event.ctrlKey) combo += 'Ctrl+';
    if (event.shiftKey) combo += 'Shift+';
    if (event.altKey) combo += 'Alt+';
    combo += event.key;
    return combo;
  }
}
