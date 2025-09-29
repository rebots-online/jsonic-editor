export class ShortcutManager {
    constructor() {
        this.shortcuts = new Map();
    }
    registerShortcut(keys, callback) {
        this.shortcuts.set(keys, callback);
    }
    unregisterShortcut(keys) {
        this.shortcuts.delete(keys);
    }
    handleKeyDown(event) {
        const combo = this.parseKeyCombo(event);
        const cb = this.shortcuts.get(combo);
        if (cb)
            cb();
    }
    parseKeyCombo(event) {
        let combo = '';
        if (event.ctrlKey)
            combo += 'Ctrl+';
        if (event.shiftKey)
            combo += 'Shift+';
        if (event.altKey)
            combo += 'Alt+';
        combo += event.key;
        return combo;
    }
}
