export interface ErrorRecord {
  message: string;
  type: 'error' | 'warning';
  date: Date;
}

export class ErrorHandler {
  private history: ErrorRecord[] = [];

  handleError(error: Error, context?: string): void {
    this.displayError(`${context || 'Error'}: ${error.message}`, 'error');
  }

  displayError(message: string, type: 'error' | 'warning'): void {
    this.history.push({ message, type, date: new Date() });
    console.error(message);
  }

  clearErrors(): void {
    this.history = [];
  }

  getErrorHistory(): ErrorRecord[] {
    return this.history;
  }
}
