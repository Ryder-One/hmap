export class Environment {
    static _instance: Environment;

    get devMode(): boolean { return this._devMode; }
    get scoutMode(): boolean { return this._scoutMode; }
    get scavengerMode(): boolean { return this._scavengerMode; }
    get shamanMode(): boolean { return this._shamanMode; }
    get dev(): boolean { return this._devMode; }
    get d(): boolean { return this._devMode; }

    set devMode(dev: boolean) {
        this._devMode = dev;
    }

    set scavengerMode(scavenger: boolean) {
        this._scavengerMode = scavenger;
    }

    set shamanMode(shaman: boolean) {
        this._shamanMode = shaman;
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
    private _shamanMode = false;

    static getInstance(): Environment {
        if (Environment._instance === undefined) {
            Environment._instance = new Environment();
        }
        return Environment._instance;
    }
}
