export class ErrorHandler {
    constructor() {
        this.history = [];
    }
    handleError(error, context) {
        this.displayError(`${context || 'Error'}: ${error.message}`, 'error');
    }
    displayError(message, type) {
        this.history.push({ message, type, date: new Date() });
        console.error(message);
    }
    clearErrors() {
        this.history = [];
    }
    getErrorHistory() {
        return this.history;
    }
}
