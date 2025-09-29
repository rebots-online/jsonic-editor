import { useEffect, useState } from 'react';
export function useAppState(store) {
    const [state, setState] = useState(store.getState());
    useEffect(() => {
        const listener = (s) => setState(s);
        store.subscribe(listener);
        return () => store.unsubscribe(listener);
    }, [store]);
    return state;
}
