import { HMapDataPayload, HMapData } from './abstract';
import { HMapPoint } from '../hmap';
import { HMapRuinType } from '../maps/ruin';
import { HMapRandom } from '../random';

// declared in host page
declare let haxe: any;
declare let StringTools: any;
declare let ExploCommon: any;

/**
 * JSON map paramaters; feel free to complete
 */
export interface HMapRuinDataJSON {
    _d: boolean;                    // ???
    _h: number;                     // height
    _k: number;                     // building type : k = 0: bunker, k = 1: motel, k = 2: hospital
    _r: HMapRuinLocalDataJSON;
    _w: number;                     // width
    _mid: number;                   // map id
    _zid: number;                   // zone id
}

export interface HMapRuinRoomJSON {
    _doorKind: number;              // kind of doors (seen 0 and 3)
    _locked: boolean;               // locked or not
}

export interface HMapRuinLocalDataJSON {
    _dirs: Array<boolean>;              // 4 available directions left top right bottom
    _move: boolean;                     // ?? can move ?
    _d: {
        _exit: boolean;                 // exit place
        _room: HMapRuinRoomJSON | null;
        _seed: number;                  // random seed
        _k: number;                     // ?? kills ?
        _w: boolean;                    // ???
        _z: number;                     // number of zombies
    };
    _o: number;                         // Oxygen : 300000 = 100%, 1% = 3sec
    _r: boolean;                        // Is it a room or not
    _x: number;                         // x coordinate
    _y: number;                         // y coordinate
}

export type HMapWallNumber = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L';
export type HMapZoneNumber = 'Z1' | 'Z2' | 'Z3' | 'Z4' | 'Z5';

type HMapWallObjects = {
    [K in HMapRuinType]: {
        [P in HMapWallNumber]: Array<string>;
    };
};

type HMapZoneObjects = {
    [K in HMapRuinType]: {
        [P in HMapZoneNumber]: Array<string>;
    };
};


/**
 * This class is the store of the map. It handles the data originally
 * passed to flash, and expose it in a JSON format with lots of accessors
 */
export class HMapRuinData extends HMapData<HMapRuinDataJSON, HMapRuinLocalDataJSON> {

    public walls: HMapWallObjects = {
        'motel' : {
            'A' : ['wall_bench_A'],
            'B' : ['wall_bench_B', 'wall_palmtree_B'],
            'C' : [],
            'D' : ['wall_flowers_D'],
            'E' : ['wall_flowers_E'],
            'F' : [],
            'G' : ['wall_bench_G', 'wall_palmtree_G'],
            'H' : ['wall_bench_H'],
            'I' : [],
            'J' : [],
            'K' : [],
            'L' : []
        },
        'bunker' : {
            'A' : ['wall_hatch_A'],
            'B' : [/* 'wall_gutter_B', */'wall_hatch_B'],
            'C' : [],
            'D' : ['wall_barrel_D', 'wall_grid_D', 'wall_pipe_D'],
            'E' : ['wall_barrel_E', 'wall_grid_E', 'wall_pipe_E'],
            'F' : [],
            'G' : [/* 'wall_gutter_G', */'wall_hatch_G'],
            'H' : ['wall_hatch_H'],
            'I' : [],
            'J' : [],
            'K' : [],
            'L' : []
        },
        'hospital' : {
            'A' : [],
            'B' : [],
            'C' : [],
            'D' : ['wall_bed_D', 'wall_dead_D'],
            'E' : ['wall_bed_E', 'wall_dead_E'],
            'F' : [],
            'G' : [],
            'H' : [],
            'I' : [],
            'J' : ['wall_grid_J'],
            'K' : ['wall_grid_K'],
            'L' : []
        }
    };

    public zones: HMapZoneObjects = {
        'motel' : {
            'Z1' : ['zone_dead_left', 'zone_stain_left'],
            'Z2' : ['zone_dead_top', 'zone_stain_top'],
            'Z3' : ['zone_dead_right', 'zone_stain_right'],
            'Z4' : ['zone_dead_bottom', 'zone_stain_bottom'],
            'Z5' : ['zone_dead_left', 'zone_dead_right']
        },
        'bunker':  {
            'Z1' : [],
            'Z2' : [],
            'Z3' : [],
            'Z4' : [],
            'Z5' : []
        },
        'hospital' : {
            'Z1' : ['zone_dead_left'],
            'Z2' : ['zone_dead_top'],
            'Z3' : ['zone_dead_right'],
            'Z4' : ['zone_dead_bottom'],
            'Z5' : ['zone_dead_left', 'zone_dead_right']
        }
    };

    /**
     * Create a fake ruin for debug purpose
     */
    public fakeRuinDirections = [
        [
            [false, false, false, false], [false, false, false, false], [false, false, false, false], [false, false, false, false],
            [false, false, false, false], [false, false, false, false], [false, false, false, false], [false, false, false, true],
            [false, false, false, false], [false, false, false, false], [false, false, false, false], [false, false, false, false],
            [false, false, false, false], [false, false, false, false], [false, false, false, false]
        ],
        [
            [false, false, false, false], [false, false, false, false], [false, false, false, false], [false, false, false, false],
            [false, false, false, true], [false, false, false, false], [false, false, true, true], [true, true, true, false],
            [true, false, true, false], [true, false, true, false], [true, false, true, true], [true, false, true, false],
            [true, false, false, true], [false, false, false, false], [false, false, false, false]
        ],
        [
            [false, false, false, false], [false, false, false, false], [false, false, false, false], [false, false, true, true],
            [true, true, true, false], [true, false, true, false], [true, true, false, true], [false, false, false, false],
            [false, false, false, false], [false, false, false, false], [false, true, false, true], [false, false, false, false],
            [false, true, true, true], [true, false, false, false], [false, false, false, false]
        ],
        [
            [false, false, false, false], [false, false, false, false], [false, false, false, false], [false, true, false, true],
            [false, false, false, false], [false, false, false, false], [false, true, true, false], [true, false, true, false],
            [true, false, true, false], [true, false, true, false], [true, true, true, true], [true, false, true, false],
            [true, true, false, true], [false, false, false, false], [false, false, false, false]
        ],
        [
            [false, false, true, true], [true, false, true, false], [true, false, true, false], [true, true, false, false],
            [false, false, false, false], [false, false, false, true], [false, false, false, false], [false, false, false, false],
            [false, false, false, false], [false, false, false, false], [false, true, false, true], [false, false, false, false],
            [false, true, false, true], [false, false, false, false], [false, false, false, false]
        ],
        [
            [false, true, false, true], [false, false, false, false], [false, false, false, false], [false, false, false, false],
            [false, false, false, false], [false, true, true, true], [true, false, true, false], [true, false, false, true],
            [false, false, false, false], [false, false, false, false], [false, true, true, false], [true, false, true, false],
            [true, true, true, false], [true, false, false, true], [false, false, false, false]
        ],
        [
            [false, true, true, false], [true, false, true, false], [true, false, false, true], [false, false, false, false],
            [false, false, false, false], [false, true, false, true], [false, false, false, false], [false, true, true, false],
            [true, false, false, true], [false, false, false, false], [false, false, false, false], [false, false, false, false],
            [false, false, false, false], [false, true, false, true], [false, false, false, false]
        ],
        [
            [false, false, false, false], [false, false, false, false], [false, true, true, false], [true, false, true, true],
            [true, false, true, false], [true, true, false, true], [false, false, false, false], [false, false, false, false],
            [false, true, true, false], [true, false, true, true], [true, false, true, false], [true, false, false, true],
            [false, false, false, false], [false, true, false, false], [false, false, false, false]
        ],
        [
            [false, false, false, false], [false, false, false, false], [false, false, false, false], [false, true, false, false],
            [false, false, false, false], [false, true, false, false], [false, false, false, false], [false, false, false, false],
            [false, false, false, false], [false, true, false, false], [false, false, false, false], [false, true, false, false],
            [false, false, false, false], [false, false, false, false], [false, false, false, false]
        ]
    ];

    get height(): number { return this.data._h; }
    get width(): number { return this.data._w; }
    get position(): HMapPoint { return { x: this.data._r._x, y: this.data._r._y }; }
    get directions(): Array<Boolean> { return this.data._r._dirs; }
    get directionsStr(): string { return '' + (+this.directions[0]) + (+this.directions[1]) + (+this.directions[2]) + (+this.directions[3]); }
    get oxygen(): number { return this.data._r._o; }
    get ruinType(): HMapRuinType {
        if (this.data._k === 0) {
            return 'bunker';
        } else if (this.data._k === 1) {
            return 'motel';
        } else {
            return 'hospital';
        }
    }
    get zoneId(): number { return this.data._zid; }
    get exit(): boolean { return this.data._r._d._exit; }
    get seed(): number { return this.data._r._d._seed; }
    get zombies(): number { return this.data._r._d._z; }
    get door(): HMapRuinRoomJSON | null { return this.data._r._d._room; }
    get room(): boolean { return this.data._r._r; }
    get kills(): number { return this.data._r._d._k; }

    constructor(mapDataPayload?: HMapDataPayload) {
        super(mapDataPayload);
    }

    /**
     * Decode the url encoded flashvar
     */
    decode(urlEncoded: string): Object {
        let st: any, hx: any, ec: any;

        try {
            // @ts-ignore
            const page = window.wrappedJSObject;
            if (page !== undefined && page.StringTools && page.ExploCommon && page.haxe) { // greasemonkey ...
                st = page.StringTools;
                hx = page.haxe;
                ec = page.ExploCommon;
            } else if (StringTools && haxe && ExploCommon) { // tampermonkey
                st = StringTools;
                hx = haxe;
                ec = ExploCommon;
            }

            const tempMapData = st.urlDecode(urlEncoded);
            return hx.Unserializer.run(this.binaryToMessage(ec.genKey(tempMapData.length), ec.permute(tempMapData)));
        } catch (err) {
            console.error('HMapRuinData::decode - caught an exception during decoding', err, urlEncoded);
            throw err;
        }
    }

    /**
     * create a fake JSON to debug the map
     */
    fakeData(force = false): HMapRuinDataJSON {
        if (this._fakeData !== undefined && force === false) {
            return this._fakeData;
        } else {
            this._fakeData = {
                _d: true,
                _h: 9,
                _k: HMapRandom.getOneOfNoSeed([0, 1, 2]),
                _r: {
                    _dirs: [false, false, false, true],
                    _move: true,
                    _d: {
                        _exit: true,
                        _room: null,
                        _seed: HMapRandom.getRandomIntegerNoSeed(100, 1000),
                        _k: 0,
                        _w: false,
                        _z: 0
                    },
                    _o: 300000,
                    _r: false,
                    _x: 7,
                    _y: 0
                },
                _w: 15,
                _mid: HMapRandom.getRandomIntegerNoSeed(1000, 100000),
                _zid: HMapRandom.getRandomIntegerNoSeed(1000, 100000)
            };
            return this._fakeData!;
        }
    }

    /**
     * Get the next directions
     */
    getFakeDirs(pos: HMapPoint): Array<boolean> {
        return this.fakeRuinDirections[pos.y][pos.x];
    }

    /**
     * JSON patching separated to enable dev mode
     */
    protected patchDataJSON(data: HMapRuinLocalDataJSON) {
        this.data._r = data;
    }
}
