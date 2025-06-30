import { useEffect, useState } from 'react';
import { AppStore } from '../state/stores/app-store';
import { AppState } from '../types/core';

export function useAppState(store: AppStore) {
  const [state, setState] = useState<AppState>(store.getState());
  useEffect(() => {
    const listener = (s: AppState) => setState(s);
    store.subscribe(listener);
    return () => store.unsubscribe(listener);
  }, [store]);
  return state;
}
