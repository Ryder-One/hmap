import { HMapNeighbour, HMapPosition, HMapNeighbours } from '../neighbours';
import { HMapRandom } from '../random';
import { HMapPoint, HMapSize } from '../hmap';
import { HMapData, HMapDataPayload } from './abstract';

// declared in host page
declare const haxe: any;
declare const StringTools: any;
declare const MapCommon: any;

export interface HMapPositionDetail {
    _c: number;                 // building id
    _s: boolean;                // ??? (soul ?)
    _t: number;                 // tag
    _z: number;                 // zombies
    _nvt: any;                  // if true, I think it has been visited but it's out of tower range. If false I'm not sure
}

export interface HMapUserJSON {
    _n: string;
    _x: number;
    _y: number;
}

/**
 * JSON map paramaters; feel free to complete
 */
export interface HMapDesertDataJSON {
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
    _r: HMapDesertLocalDataJSON;         // local informations
    _w: number;                          // width
    _x: number;                          // current X position (0,0 is top left)
    _y: number;                          // current Y position
    _town: boolean;                      // ???
    _up: boolean;                        // ???
    _view: Array<number | null>;         // personnal fog of war : null is not discovered, number is building id
    _global: Array<number | null>;       // global fog of war : null is not discovered, number is building id
    _users: null | Array<HMapUserJSON>;  // list of users when in town
    _editor: boolean;                    // ???
    _map: boolean;                       // ???
    _mid: number;                        // map id
}

export interface HMapDesertLocalDataJSON { // current position
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

/**
 * This class is the store of the map. It handles the data originally
 * passed to flash, and expose it in a JSON format with lots of accessors
 */
export class HMapDesertData extends HMapData<HMapDesertDataJSON, HMapDesertLocalDataJSON> {

    public neighbours = new HMapNeighbours();
    public town: HMapPoint;
    public buildings: Map<number, string> = new Map();
    public users: Map<number, Array<HMapUserJSON>> = new Map();

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
    get scavengerArray(): Array<boolean|null> { return this.data._r._neigDrops; }
    get details(): Array<HMapPositionDetail> { return this.data._details; }
    get global(): Array<number|null> { return this.data._global; }
    get view(): Array<number|null> { return this.data._view; }
    get townName(): string { return this.data._city; }

    constructor(mapDataPayload?: HMapDataPayload, scavengerMode = false, scoutMode = false, shamanMode = false) {
        super(mapDataPayload, scavengerMode, scoutMode, shamanMode);
        this.buildNeighbours();
        this.town = this.findTown();
        this.cacheBuildingsNames();
        this.cacheUsersOutside();
    }

    /**
     * Decode the url encoded flashvar
     */
    decode(urlEncoded: string): Object {
        let st: any, hx: any, mc: any;

        try {
            // @ts-ignore
            const page = window.wrappedJSObject;
            if (page !== undefined && page.StringTools && page.MapCommon && page.haxe) { // greasemonkey ...
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
            console.error('HMapDesertData::decode - caught an exception during decoding', err, urlEncoded);
            throw err;
        }
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
                    if (this.data._details[N.index] === undefined || this.data._details[N.index] === null) {
                        this.data._details[N.index] = {
                            _c: 0,
                            _nvt: 1,
                            _s: false,
                            _t: 0,
                            _z: 0
                        };
                    }
                    N.building = (this.data._details[N.index]._c !== null) ? this.data._details[N.index]._c : 0;
                    N.view = this.isPositionDiscovered({ x: X, y: Y });
                }
                this.neighbours.addNeighbour(N);
            }
        }
    }

    /**
     * create a fake JSON to debug the map
     */
    fakeData(force = false, scavengerMode: boolean, scoutMode: boolean, shamanMode: boolean): HMapDesertDataJSON {
        if (this._fakeData !== undefined && force === false) {
            return this._fakeData;
        } else {
            const mapSize = HMapRandom.getRandomIntegerNoSeed(8, 25);

            const town = {
                x: HMapRandom.getRandomIntegerNoSeed(3, mapSize - 3),
                y: HMapRandom.getRandomIntegerNoSeed(3, mapSize - 3)
            };

            this._fakeData = {
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
                    _t: HMapRandom.getRandomIntegerNoSeed(0, 12),
                    _z: 0,
                    _zid: HMapRandom.getRandomIntegerNoSeed(111111, 999999)
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
                _mid: HMapRandom.getRandomIntegerNoSeed(111111, 999999)
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
                        1 : (HMapRandom.getRandomIntegerNoSeed(0, 10) === 5 ?  HMapRandom.getRandomIntegerNoSeed(2, 62) : 0 );

                    bid = HMapRandom.getRandomIntegerNoSeed(0, 10) === 5 ? -1 : bid;

                    buildings.push({_id: bid, _n: 'Building ' + bid});

                    console.log('ShamanMode ' + shamanMode);

                    this._fakeData._details.push({
                        _c: bid,
                        _s: shamanMode === true ? HMapRandom.getRandomIntegerNoSeed(0, 10) === 1 : false,
                        _t: HMapRandom.getRandomIntegerNoSeed(0, 12),
                        _z: HMapRandom.getRandomIntegerNoSeed(0, 3) === 2 ? HMapRandom.getRandomIntegerNoSeed(0, 18) : 0,
                        _nvt: view
                    });
                    if (view === true) {
                        this._fakeData._view.push(bid);
                    } else {
                        this._fakeData._view.push(null);
                    }

                    if (bid === 1) {
                        townIndex = index;
                    }
                    index++;
                }
            }
            this._fakeData._global = this._fakeData._view;
            this._fakeData._b = buildings;

            if (scoutMode === true) {
                this._fakeData._r._neig = new Array();
                if (townIndex - mapSize > 0) {
                    this._fakeData._r._neig.push(this._fakeData._details[townIndex - mapSize]._z);
                } else {
                    this._fakeData._r._neig.push(0);
                }
                if (townIndex + 1 < (mapSize * mapSize) ) {
                    this._fakeData._r._neig.push(this._fakeData._details[townIndex + 1]._z);
                } else {
                    this._fakeData._r._neig.push(0);
                }
                if (townIndex + mapSize < (mapSize * mapSize) ) {
                    this._fakeData._r._neig.push(this._fakeData._details[townIndex + mapSize]._z);
                } else {
                    this._fakeData._r._neig.push(0);
                }
                if (townIndex - 1 > 0 ) {
                    this._fakeData._r._neig.push(this._fakeData._details[townIndex - 1]._z);
                } else {
                    this._fakeData._r._neig.push(0);
                }
            }

            if (scavengerMode === true) {
                this._fakeData._r._neigDrops.push(HMapRandom.getOneOfNoSeed([null, true, false]));
                this._fakeData._r._neigDrops.push(HMapRandom.getOneOfNoSeed([null, true, false]));
                this._fakeData._r._neigDrops.push(HMapRandom.getOneOfNoSeed([null, true, false]));
                this._fakeData._r._neigDrops.push(HMapRandom.getOneOfNoSeed([null, true, false]));
            }

            return this._fakeData;
        }
    }

    /**
     * JSON patching separated to enable dev mode
     */
    protected patchDataJSON(data: HMapDesertLocalDataJSON) {
        this.data._r = data;

        // update the details and the view
        const indexNewPosition = this.getIndex({ x: this.data._x, y: this.data._y });
        this.data._details[indexNewPosition]._c = this.data._r._c;
        this.data._details[indexNewPosition]._t = this.data._r._t;
        this.data._details[indexNewPosition]._z = this.data._r._z;
        if (this.data._details[indexNewPosition]._nvt === null) {
            this.data._details[indexNewPosition]._nvt = false;
        }
        this.data._view[indexNewPosition] = this.data._r._c;
        this.data._global[indexNewPosition] = this.data._r._c;

        // dont forget to rebuild the neighbours (its usually done in the constructor)
        this.buildNeighbours();
    }

    /**
     * Find the town and return it
     */
    private findTown(): HMapPoint {
        for (let index = 0, length = this.data._details.length; index < length; index++) {
            if (this.data._details[index] === undefined || this.data._details[index] === null) {
                continue;
            }
            if (this.data._details[index] !== undefined && this.data._details[index]._c === 1) {
                return this.getCoordinates(index);
            }
        }
        return { x: 0, y: 0 }; // this case is not possible but it makes typescript happy
    }

    private cacheBuildingsNames(): void {
        this.data._b.forEach((B) => {
            this.buildings.set(B._id, B._n);
        });
    }

    /**
     * Index the users in a good container (this.users)
     */
    private cacheUsersOutside(): void {
        if (this.data._users !== null && this.data._users.length > 0) {
            this.data._users.forEach(user => {
                const userIndex = this.getIndex({x: user._x, y: user._y});
                let userOnThisPosition = this.users.get(userIndex);
                if (userOnThisPosition === undefined || userOnThisPosition === null) {
                    userOnThisPosition = new Array();
                }
                userOnThisPosition.push(user);
                this.users.set(userIndex, userOnThisPosition);
            });
        }
    }
}
