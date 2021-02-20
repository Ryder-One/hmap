import { Environment } from "../environment";

export interface HMapDataPayload {
    raw?: string;
    JSON?: Object;
}

/**
 * This class is the store of the map. It handles the data originally
 * passed to flash, and expose it in a JSON format with lots of accessors
 */
export abstract class HMapData<DataJSON, LocalDataJSON> {

    public _fakeData?: DataJSON;
    public data: DataJSON;

    get prettyData(): string { return JSON.stringify(this.data, undefined, 4); }

    constructor(mapDataPayload?: HMapDataPayload) {
        if (mapDataPayload && mapDataPayload.raw) {
            this.data = this.decode(mapDataPayload.raw) as DataJSON;
        } else if (mapDataPayload && mapDataPayload.JSON) {
            this.data = mapDataPayload.JSON as DataJSON;
        } else {
            this.data = this.fakeData(true);
        }
    }

    patchData(data: HMapDataPayload) {
        let decodedData: LocalDataJSON;
        if (data.raw) {
            decodedData = this.decode(data.raw) as LocalDataJSON;
        } else if (data.JSON) {
            decodedData = data.JSON as LocalDataJSON;
        } else {
            throw new Error('HMapData::patchData - Cannot patch empty data');
        }

        this.patchDataJSON(decodedData!);
    }

    /**
     * @param char Type script does not have a type for
     */
    protected translate(char: any): any | null {
        if (char >= 65 && char <= 90) {
            return char - 65;
        }
        if (char >= 97 && char <= 122) {
            return char - 71;
        }
        if (char >= 48 && char <= 57) {
            return char + 4;
        }
        return null;
    }

    /**
     * @param key generated by haxe
     * @param message message to decode
     */
    protected binaryToMessage(key: any, message: any) {
        const keyArray = new Array();
        for (let i = 0, j = key.length; i < j; i++) {
            const char = this.translate(key.charCodeAt(i));
            if (char != null) {
                keyArray.push(char);
            }
        }
        if (keyArray.length === 0) {
            keyArray.push(0);
        }

        let returnStr = '';
        for (let n = 0, p = message.length; n < p; n++) {
            const k = message.charCodeAt(n) ^ keyArray[(n + message.length) % keyArray.length];
            returnStr += String.fromCharCode((k !== 0) ? k : message.charCodeAt(n));
        }
        return returnStr;
    }

    /**
     * create a fake JSON to debug the map
     */
    abstract fakeData(force: boolean): DataJSON;

    /**
     * Decode the url encoded flashvar
     */
    abstract decode(urlEncoded: string): Object;

    /**
     * JSON patching separated to enable dev mode
     */
    protected abstract patchDataJSON(data: LocalDataJSON): void;
}
