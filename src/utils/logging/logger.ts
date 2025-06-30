export class Logger {
  log(level: string, message: string, data?: any): void {
    console.log(`[${level}]`, message, data);
  }

  error(message: string, error?: Error): void {
    this.log('error', message, error);
  }

  warn(message: string, data?: any): void {
    this.log('warn', message, data);
  }

  info(message: string, data?: any): void {
    this.log('info', message, data);
  }

  debug(message: string, data?: any): void {
    this.log('debug', message, data);
  }
}
