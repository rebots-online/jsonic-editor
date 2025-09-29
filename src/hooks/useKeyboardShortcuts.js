import { useEffect } from 'react';
export const useKeyboardShortcuts = (shortcuts) => {
    useEffect(() => {
        const handleKeyDown = (event) => {
            const key = event.key.toLowerCase();
            const modifiers = [];
            if (event.ctrlKey || event.metaKey)
                modifiers.push('ctrl');
            if (event.shiftKey)
                modifiers.push('shift');
            if (event.altKey)
                modifiers.push('alt');
            const shortcut = [...modifiers, key].join('+');
            if (shortcuts[shortcut]) {
                event.preventDefault();
                shortcuts[shortcut]();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [shortcuts]);
};
