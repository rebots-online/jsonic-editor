export class AppStore {
    constructor(initial) {
        this.listeners = new Set();
        this.state = initial;
    }
    getState() {
        return this.state;
    }
    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.emit();
    }
    subscribe(listener) {
        this.listeners.add(listener);
    }
    unsubscribe(listener) {
        this.listeners.delete(listener);
    }
    emit() {
        for (const l of this.listeners)
            l(this.state);
    }
}
