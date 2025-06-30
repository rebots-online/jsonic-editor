import { AppState } from '../../types/core';

export type StateListener = (state: AppState) => void;

export class AppStore {
  private state: AppState;
  private listeners: Set<StateListener> = new Set();

  constructor(initial: AppState) {
    this.state = initial;
  }

  getState(): AppState {
    return this.state;
  }

  setState(newState: Partial<AppState>): void {
    this.state = { ...this.state, ...newState };
    this.emit();
  }

  subscribe(listener: StateListener): void {
    this.listeners.add(listener);
  }

  unsubscribe(listener: StateListener): void {
    this.listeners.delete(listener);
  }

  private emit(): void {
    for (const l of this.listeners) l(this.state);
  }
}
