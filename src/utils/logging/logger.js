export class Logger {
    log(level, message, data) {
        console.log(`[${level}]`, message, data);
    }
    error(message, error) {
        this.log('error', message, error);
    }
    warn(message, data) {
        this.log('warn', message, data);
    }
    info(message, data) {
        this.log('info', message, data);
    }
    debug(message, data) {
        this.log('debug', message, data);
    }
}
