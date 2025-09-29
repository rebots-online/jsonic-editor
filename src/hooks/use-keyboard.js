import { useEffect } from 'react';
export function useKeyboard(manager) {
    useEffect(() => {
        const handler = (e) => manager.handleKeyDown(e);
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [manager]);
}
