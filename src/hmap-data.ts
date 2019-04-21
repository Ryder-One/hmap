import { HMapNeighbour, HMapPosition, HMapNeighbours } from './neighbours';
import { HMapRandom } from './random';
import { HMapPoint, HMapSize } from './hmap';

// declared in host page
declare var haxe: any;
declare var StringTools: any;
declare var MapCommon: any;

export interface HMapDataPayload {
    raw?: string;
    JSON?: Object;
}

export interface HMapPositionDetail {               // big array representing the map
    _c: number;                 // building id
    _s: boolean;                // ??? (soul ?)
    _t: number;                 // tag
    _z: number;                 // zombies
    _nvt: any;                  // when true, it has been visited but it's out of tower range
}

/**
 * JSON map paramaters; feel free to complete
 */
export interface HMapDataJSON {
    _details: Array<HMapPositionDetail>; // big array representing the map
    _city: string;                       // city name
    _hour: number;                       // server hour
    _path: any;                          // ???
    _slow: boolean;                      // ???
    _b: Array<{                          // list of all buildings
        _n: string;                      // building name
        _id: number;                     // building id
    }>;
    _e: Array<any>;                      // ???
    _h: number;                          // height
    _r: HMapPatchDataJSON;
    _w: number;                          // width
    _x: number;                          // current X position (0,0 is top left)
    _y: number;                          // current Y position
    _town: boolean;                      // ???
    _up: boolean;                        // ???
    _view: Array<number | null>;         // personnal fog of war : null is not discovered, number is building id
    _global: Array<number | null>;       // global fog of war : null is not discovered, number is building id
    _users: null | Array<any>;           // list of users when in town
    _editor: boolean;                    // ???
    _map: boolean;                       // ???
    _mid: number;                        // map id
}

export interface HMapPatchDataJSON { // current position
    _neigDrops: Array<any>;     // ???
    _neig: Array<number>;       // number of zombies of [0] => north [1] => east, etc.
    _state: boolean;            // true = loose control of the position
    _c: number;                 // building id
    _h: number;                 // number of humans
    _m: number;                 // number of action points
    _t: number;                 // ??? (zone tag ?)
    _z: number;                 // number of zombies
    _zid: number;               // zone id
}

export class HMapData {

    public static _fakeData: HMapDataJSON;

    public data: HMapDataJSON;
    public neighbours = new HMapNeighbours();
    public town: HMapPoint;
    public buildings: Map<number, string> = new Map();

    get size(): HMapSize { return { width: this.data._w, height: this.data._h }; }
    get position(): HMapPoint { return { x: this.data._x, y: this.data._y }; }
    get index(): number { return this.getIndex({ x: this.data._x, y: this.data._y }); }
    get actionPoints(): number { return this.data._r._m; }
    get numberOfHumans(): number { return this.data._r._h; }
    get zoneId(): number { return this.data._r._zid; }
    get numberOfZombies(): number { return this.data._r._z; }
    get hour(): number { return this.data._hour; }
    get hasControl(): boolean { return !this.data._r._state; }
    get scoutArray(): Array<number> { return this.data._r._neig; }
    get details(): Array<HMapPositionDetail> { return this.data._details; }
    get global(): Array<number|null> { return this.data._global; }
    get view(): Array<number|null> { return this.data._view; }
    get townName(): string { return this.data._city; }

    /**
     * create a fake JSON to debug the map
     */
    static fakeData(force = false): HMapDataJSON {
        if (HMapData._fakeData !== undefined && force === false) {
            return HMapData._fakeData;
        } else {
            const mapSize = HMapRandom.getRandomInteger(15, 25);

            const town = {
                x: HMapRandom.getRandomInteger(3, mapSize - 3),
                y: HMapRandom.getRandomInteger(3, mapSize - 3)
            };

            HMapData._fakeData = {
                _details: new Array(),
                _city: 'Oh yeah',
                _hour: 17,
                _path: null,
                _slow: true,
                _b: new Array(),
                _e: new Array(),
                _h: mapSize,
                _r: {
                    _neigDrops: new Array(),
                    _neig: new Array(),
                    _state: false,
                    _c: 1,
                    _h: 1,
                    _m: 6,
                    _t: 0,
                    _z: 0,
                    _zid: HMapRandom.getRandomInteger(111111, 999999)
                },
                _w: mapSize,
                _x: town.x,
                _y: town.y,
                _town: false,
                _up: false,
                _view: new Array(),
                _global: new Array(),
                _users: null,
                _editor: false,
                _map: false,
                _mid: HMapRandom.getRandomInteger(111111, 999999)
            };

            let index = 0, townIndex = 0;
            const buildings = new Array();
            for (let y = 0; y < mapSize; y++) {
                for (let x = 0; x < mapSize; x++) {
                        let view = false;
                    if (x < town.x + 5 && x > town.x - 5 && y < town.y + 5 && y > town.y - 5) {
                        view = true;
                    }
                    let bid = (town.x === x && town.y === y) ?
                        1 : (HMapRandom.getRandomInteger(0, 10) === 5 ?  HMapRandom.getRandomInteger(2, 62) : 0 );

                    bid = HMapRandom.getRandomInteger(0, 10) === 5 ? -1 : bid;

                    buildings.push({_id: bid, _n: 'Building ' + bid});

                    HMapData._fakeData._details.push({
                        _c: bid,
                        _s: false,
                        _t: 0,
                        _z: HMapRandom.getRandomInteger(0, 3) === 2 ? HMapRandom.getRandomInteger(0, 18) : 0,
                        _nvt: view
                    });
                    if (view === true) {
                        HMapData._fakeData._view.push(bid);
                    } else {
                        HMapData._fakeData._view.push(null);
                    }

                    if (bid === 1) {
                        townIndex = index;
                    }
                    index++;
                }
            }
            HMapData._fakeData._global = HMapData._fakeData._view;
            HMapData._fakeData._b = buildings;

            HMapData._fakeData._r._neig = new Array();
            if (townIndex - mapSize > 0) {
                HMapData._fakeData._r._neig.push(HMapData._fakeData._details[townIndex - mapSize]._z);
            } else {
                HMapData._fakeData._r._neig.push(0);
            }
            if (townIndex + 1 < (mapSize * mapSize) ) {
                HMapData._fakeData._r._neig.push(HMapData._fakeData._details[townIndex + 1]._z);
            } else {
                HMapData._fakeData._r._neig.push(0);
            }
            if (townIndex + mapSize < (mapSize * mapSize) ) {
                HMapData._fakeData._r._neig.push(HMapData._fakeData._details[townIndex + mapSize]._z);
            } else {
                HMapData._fakeData._r._neig.push(0);
            }
            if (townIndex - 1 > 0 ) {
                HMapData._fakeData._r._neig.push(HMapData._fakeData._details[townIndex - 1]._z);
            } else {
                HMapData._fakeData._r._neig.push(0);
            }

            return HMapData._fakeData;
        }
    }

    /**
     * @param rawData Binary data coming from HTML page
     */
    constructor(rawData?: any, data?: HMapDataJSON) {
        if (rawData) {
            this.data = this.decode(rawData) as HMapDataJSON;
        } else if (data) {
            this.data = data;
        } else {
            throw new Error('Cannot create HMapData from empty parameters');
        }

        this.buildNeighbours();
        this.town = this.findTown();
        this.cacheBuildingsNames();
    }


    /**
     * Patch the mapData with a new set of data (only _r)
     * @warning : this method wont rebuild the neighbours because it should be
     * done when patch data AND move position are done
     */
    patchData(data: HMapDataPayload) {
        let decodedData: HMapPatchDataJSON;
        if (data.raw) {
            decodedData = this.decode(data.raw) as HMapPatchDataJSON;
        } else if (data.JSON) {
            decodedData = data.JSON as HMapPatchDataJSON;
        } else {
            throw new Error('HMapData::patchData - Cannot patch empty data');
        }

        this.patchDataJSON(decodedData!);
    }

    /**
     * JSON patching separated to enable dev mode
     */
    private patchDataJSON(data: HMapPatchDataJSON) {
        this.data._r = data;

        // update the details and the view
        const indexNewPosition = this.getIndex({ x: this.data._x, y: this.data._y });
        this.data._details[indexNewPosition]._c = this.data._r._c;
        this.data._details[indexNewPosition]._t = this.data._r._t;
        this.data._details[indexNewPosition]._z = this.data._r._z;
        this.data._view[indexNewPosition] = this.data._r._c;

        // dont forget to rebuild the neighbours (its usually done in the constructor)
        this.buildNeighbours();
    }

    getPositionRelativeToTown(position: HMapPoint): HMapPoint {
        return  { x: position.x - this.town.x, y: this.town.y - position.y };
    }

    /**
     * Called with +/- 1 on x or y when we move the map
     */
    movePosition(offsetX: number, offsetY: number) {
        this.data._x += offsetX;
        this.data._y += offsetY;
    }

    /**
     * Get the map index from the coordinates
     */
    getIndex(position: HMapPoint): number {
        return position.x + (position.y * this.size.width);
    }

    /**
     * Returns the position from the index and the width
     * @param index index in the big array
     * @param sizeX width
     */
    getCoordinates(index: number): HMapPoint {
        return {
            y: Math.floor(index / this.size.width),
            x: index % this.size.width
        };
    }

    /**
     * Return true if the coordinates are in map bounds
     */
    inBounds(pos: HMapPoint): boolean {
        return pos.x >= 0 && pos.y >= 0 && pos.x < this.size.width && pos.y < this.size.height;
    }

    /**
     * Return true if the positon has already been discovered
     */
    isPositionDiscovered(pos: HMapPoint) {
        const index = this.getIndex(pos);
        return (this.data._view[index] !== null && this.data._view[index] !== undefined) ? true : false;
    }

    /**
     * Create the neighbours map
     */
    buildNeighbours() {
        this.neighbours.neighbours = new Map();

        for (let X = this.position.x - 1; X <= this.position.x + 1; X++) {
            for (let Y = this.position.y - 1; Y <= this.position.y + 1; Y++) {
                const outbounds = !this.inBounds({ x: X, y: Y });

                let p: HMapPosition;

                if (X < this.position.x) {
                    if (Y < this.position.y) {
                        p = 'top_left';
                    } else if (Y === this.position.y) {
                        p = 'middle_left';
                    } else {
                        p = 'bottom_left';
                    }
                } else if (X === this.position.x) {
                    if (Y < this.position.y) {
                        p = 'top_center';
                    } else if (Y === this.position.y) {
                        p = 'middle_center';
                    } else {
                        p = 'bottom_center';
                    }
                } else {
                    if (Y < this.position.y) {
                        p = 'top_right';
                    } else if (Y === this.position.y) {
                        p = 'middle_right';
                    } else {
                        p = 'bottom_right';
                    }
                }

                const N = new HMapNeighbour(X, Y, p, outbounds, this.getIndex({ x: X, y: Y }), false, 0);

                if (!N.outbounds) {
                    N.building = (this.data._details[N.index]._c !== null) ? this.data._details[N.index]._c : 0;
                    N.view = this.isPositionDiscovered({ x: X, y: Y });
                }
                this.neighbours.addNeighbour(N);
            }
        }
    }

    /**
     * Find the town and return it
     */
    private findTown(): HMapPoint {
        for (let index = 0, length = this.data._details.length; index < length; index++) {
            if (this.data._details[index]._c === 1) {
                return this.getCoordinates(index);
            }
        }
        return { x: 0, y: 0 }; // this case is not possible but it makes typescript happy
    }

    /**
     * Decode the url encoded flashvar
     */
    private decode(urlEncoded: string): Object {
        let st: any, hx: any, mc: any;

        try {
            // @ts-ignore
            const page = window.wrappedJSObject;
            if (page && page.StringTools && page.MapCommon && page.haxe) { // greasemonkey ...
                st = page.StringTools;
                hx = page.haxe;
                mc = page.MapCommon;
            } else if (StringTools && haxe && MapCommon) { // tampermonkey
                st = StringTools;
                hx = haxe;
                mc = MapCommon;
            }
            const tempMapData = st.urlDecode(urlEncoded);
            return hx.Unserializer.run(this.binaryToMessage(mc.genKey(tempMapData.length), mc.permute(tempMapData)));
        } catch (err) {
            console.error('HMapData::decode - caught an exception during decoding', err, urlEncoded);
            throw err;
        }
    }

    /**
     * @param char Type script does not have a type for
     */
    private translate(char: any): any | null {
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
    private binaryToMessage(key: any, message: any) {
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

    private cacheBuildingsNames(): void {
        this.data._b.forEach((B) => {
            this.buildings.set(B._id, B._n);
        });
    }
}
