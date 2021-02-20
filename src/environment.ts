export class Environment {
    static _instance: Environment;

    get devMode(): boolean { return this._devMode; }
    get scoutMode(): boolean { return this._scoutMode; }
    get scavengerMode(): boolean { return this._scavengerMode; }
    get dev(): boolean { return this._devMode; }
    get d(): boolean { return this._devMode; }

    set devMode(dev: boolean) {
        this._devMode = dev;
    }

    set scavengerMode(scavenger: boolean) {
        this._scavengerMode = scavenger;
    }

    set scoutMode(scout: boolean) {
        this._scoutMode = scout;
    }


    get url(): string {
        if (this.devMode === true) {
            return '.';
        } else {
            return 'http://ryderone.dynu.net/';
        }
    }

    private _devMode = false;
    private _scoutMode = false;
    private _scavengerMode = false;

    static getInstance(): Environment {
        if (Environment._instance === undefined) {
            Environment._instance = new Environment();
        }
        return Environment._instance;
    }
}
