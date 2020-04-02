/**
 * Logger class
 */

export class Log {
    static loggers = new Map<string, Logger>();

    static get(name: string): Logger {
        if (!Log.loggers.has(name)) {
            Log.loggers.set(name, new Logger(name, true));
        }
        return Log.loggers.get(name)!;
    }

    static enable(name: string) {
        Log.get(name).enabled = true;
    }

    static disable(name: string) {
        Log.get(name).enabled = false;
    }
}

class Logger {

    public enabled: boolean;
    public name: string;
    public method: string[] = new Array();

    constructor(name: string, enabled: true) {
        this.name = name;
        this.enabled = enabled;
    }

    public enter(method: string) {
        this.method.push(method);
        this.log('Entering method', method);
    }

    public leave(method: string) {
        this.log('Exiting method', method);
        this.method.pop();
    }

    public log(...args: any[]): void {
        if (this.enabled && console.log) {
            if (this.method.length !== 0) {
                let spaces = '';
                for (let i = 1; i < this.method.length; i++) {
                    spaces += '\t';
                }
                console.log(spaces + this.name + '::' + this.method.slice(-1).pop() + ' >>', ...args);
            } else {
                console.log(this.name + ' >>', ...args);
            }
        }
    }

    public warn(...args: any[]): void {
        if (this.enabled && console.warn) {
            if (this.method.length !== 0) {
                let spaces = '';
                for (let i = 0; i < this.method.length; i++) {
                    spaces += '\t';
                }
                console.warn(spaces + this.name + '::' + this.method.slice(-1).pop() + ' >>', ...args);
            } else {
                console.warn(this.name + ' >>', ...args);
            }
        }
    }

    public error(...args: any[]): void {
        if (console.error) {
            if (this.method.length !== 0) {
                let spaces = '';
                for (let i = 0; i < this.method.length; i++) {
                    spaces += '\t';
                }
                console.error(spaces + this.name + '::' + this.method.slice(-1).pop() + ' >>', ...args);
            } else {
                console.error(this.name + ' >>', ...args);
            }
        }
    }
}
