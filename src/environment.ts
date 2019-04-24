export class Environment {
    static _instance: Environment;

    get devMode(): boolean { return this._devMode; }
    get dev(): boolean { return this._devMode; }
    get d(): boolean { return this._devMode; }

    set devMode(dev: boolean) {
        this._devMode = dev;
    }

    get url(): string {
        if (this.devMode === true) {
            return './docs';
        } else {
            return 'https://ryder-one.github.io/hmap';
        }
    }

    private _devMode = false;

    static getInstance(): Environment {
        if (Environment._instance === undefined) {
            Environment._instance = new Environment();
        }
        return Environment._instance;
    }
}
