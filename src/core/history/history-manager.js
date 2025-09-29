import cloneDeep from 'lodash/cloneDeep';
export class HistoryManager {
    constructor() {
        this.history = [];
        this.pointer = -1;
    }
    recordAction(action) {
        this.history = this.history.slice(0, this.pointer + 1);
        this.history.push(cloneDeep(action));
        this.pointer = this.history.length - 1;
    }
    undo() {
        if (this.canUndo()) {
            this.pointer--;
            return true;
        }
        return false;
    }
    redo() {
        if (this.canRedo()) {
            this.pointer++;
            return true;
        }
        return false;
    }
    canUndo() {
        return this.pointer >= 0;
    }
    canRedo() {
        return this.pointer < this.history.length - 1;
    }
    clearHistory() {
        this.history = [];
        this.pointer = -1;
    }
}
