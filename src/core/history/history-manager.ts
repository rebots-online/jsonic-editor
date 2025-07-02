import { HistoryAction } from '../../types/core';
import cloneDeep from 'lodash/cloneDeep';

export class HistoryManager {
  private history: HistoryAction[] = [];
  private pointer = -1;

  recordAction(action: HistoryAction): void {
    this.history = this.history.slice(0, this.pointer + 1);
    this.history.push(cloneDeep(action));
    this.pointer = this.history.length - 1;
  }

  undo(): boolean {
    if (this.canUndo()) {
      this.pointer--;
      return true;
    }
    return false;
  }

  redo(): boolean {
    if (this.canRedo()) {
      this.pointer++;
      return true;
    }
    return false;
  }

  canUndo(): boolean {
    return this.pointer >= 0;
  }

  canRedo(): boolean {
    return this.pointer < this.history.length - 1;
  }

  clearHistory(): void {
    this.history = [];
    this.pointer = -1;
  }
}
