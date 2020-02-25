import { HMapTypeMapStr, HMapTypeSVGMap } from './maps/abstract';
import { HMapGridMap } from './maps/grid';
import { HMapDesertMap } from './maps/desert';
import { HMapRuin } from './maps/ruin';

export interface HMapPoint {
    x: number;
    y: number;
}

export interface HMapSize {
    width: number;
    height: number;
}

export type HMapLocation = 'doors' | 'desert' | 'ruin' | 'unknown';

declare const js: any; // haxe stuff

export class HMap {

    public width = 300; // for debug only, the value is 300 and there is a lot of hard coded values
    public height = 300; // for debug only, the value is 300 and there is a lot of hard coded values
    public displayFlashMap = false;

    // little green arrow target
    public target?: HMapPoint;

    public originalOnData?: CallableFunction;
    public location?: HMapLocation;

    public cssSelector = '.swf'; // selector of the map container, default is production value

    private map?: HMapTypeSVGMap;

    constructor(cssSelector?: string) {
        if (cssSelector !== undefined) {
            this.cssSelector = cssSelector;
        }
    }

    /**
     * Get the map data and launch the drawing of the map
     * This method is not straightfoward. It handles debug mode,
     * and the fact the data can be outdated in the HTML (initialized)
     * but up to date in the store
     */
    fetchMapData() {
        if (this.map === undefined) {
            this.autoBuildMap();
        }

        // We will look for the flashmap, take the data, and bootstrap our map
        let counterCheckExists = 0;
        const checkExist = setInterval(() => {
            if (document.querySelector('#swfCont') !== null) {
                clearInterval(checkExist);

                let tempMapData;
                if (document.querySelector('#FlashMap') !== null) { // if the flashmap is there
                    tempMapData = document.querySelector('#FlashMap')!.getAttribute('flashvars')!.substring(13);
                } else { // if this is only the JS code supposed to bootstrap flash
                    if (document.querySelector('#gameLayout') !== null) {

                        const scriptStr = document.querySelector('#gameLayout')!.innerHTML;
                        const mapMarker = scriptStr.indexOf('mapLoader.swf');
                        if (mapMarker === -1) {
                            return;
                        }
                        const startVar = scriptStr.indexOf('data', mapMarker) + 8;
                        const stopVar = scriptStr.indexOf('\');', startVar);
                        tempMapData = scriptStr.substring(startVar, stopVar);
                    }
                }
                this.map!.buildLayers();
                this.map!.completeDataReceived({raw: tempMapData});

            } else if (++counterCheckExists === 100) {
                clearInterval(checkExist); // timeout 10sec
            }
        }, 100); // 10 sec then give up
    }

    /**
     * Function used to setup the interceptor.
     * The interceptor will intercept data from the server, inform our map
     * and pass it back to haxe.
     */
    setupInterceptor() {

        let _js;
        // @ts-ignore : this thing is not known by the TS compiler
        const page: any = window.wrappedJSObject;

        if (page !== undefined && page.js) { // greasemonkey
            _js = page.js;
        } else { // tampermonkey
            _js = js;
        }

        if (_js && _js.XmlHttp && _js.XmlHttp.onData) { // tampermonkey
            this.originalOnData = _js.XmlHttp.onData;
            _js.XmlHttp.onData = this.dataInterceptor.bind(this);
        } else {
            throw new Error('HMap::setupInterceptor - Cannot find js.XmlHttp.onData');
        }
    }

    /**
     * Actual interceptor
     */
    dataInterceptor(data: string) {

        this.originalOnData!(data); // call the original method first

        const currentLocation = this.getCurrentLocation();
        if (currentLocation === 'unknown') { // unknown location, make sure the HMap is removed from the DOM
            this.location = 'unknown';
            this.clearMap();
            return;
        }

        // now we are in an interesting place for us, check if there is data for our map
        if (data.indexOf('js.JsMap.init') !== -1 || data.indexOf('js.JsExplo.init') !== -1 || data.indexOf('mapLoader.swf') !== -1) {
            // if we changed location or we dont have jsmap.init in the message, reload the whole map
            if (currentLocation !== this.location || data.indexOf('mapLoader.swf') !== -1) {
                this.location = currentLocation;
                this.clearMap();
                this.fetchMapData(); // it will autobuild the map
            } else { // we are still on the same location
                if (data.indexOf('js.JsMap.init') !== -1 || data.indexOf('js.JsExplo.init') !== -1) {
                    let startVar = 0;
                    if (data.indexOf('js.JsMap.init') !== -1) {
                        startVar = data.indexOf('js.JsMap.init') + 16;
                    } else {
                        startVar = data.indexOf('js.JsExplo.init') + 16;
                    }
                    const stopVar = data.indexOf('\',', startVar);
                    const tempMapData = data.substring(startVar, stopVar);
                    this.map!.partialDataReceived({ raw: tempMapData }); // just patch the data
                } else {
                    console.warn('HMap::dataInterceptor - this case hasn\'t been encoutered yet', data);
                }
            }
        }
    }

    /**
     * Guess on what page we are (outise or inside the town ) by parsing the URL
     */
    getCurrentLocation(): HMapLocation {
        if (window.location.href.indexOf('outside') !== -1) {
            return 'desert';
        } else if (window.location.href.indexOf('door') !== -1) {
            return 'doors';
        } else if (window.location.href.indexOf('explo') !== -1) {
            return 'ruin';
        } else {
            return 'unknown';
        }
    }

    /**
     * Switch the map to a new type and reload
     */
    switchMapAndReload(type: HMapTypeMapStr) {
        const store = this.map!.mapData!.data;
        this.clearMap();
        if (type === 'desert') {
            this.map = new HMapDesertMap(this);
        } else if (type === 'grid') {
            this.map = new HMapGridMap(this);
        } else if (type === 'ruin') {
            this.map = new HMapRuin(this);
        }
        this.map!.buildLayers();
        this.map!.completeDataReceived({ JSON: store });
    }

    /**
     * Rebuild the map with the JSON passed in argument. For debug mode only
     */
    reloadMapWithData(data?: any) { // @TODO fix the any ?
        this.clearMap();
        this.target = undefined;
        this.autoBuildMap();
        this.map!.buildLayers();
        this.map!.completeDataReceived({ JSON: data });
    }

    /**
     * Clear the map to draw a new one (when we switch the map from desert to grid, etc.)
     */
    private clearMap(): void {
        // destroy the dom element
        const hmap = document.querySelector('#hmap');
        if (hmap !== null && hmap.parentNode !== null) {
            hmap.parentNode.removeChild(hmap);
        }
        // unset the objects
        this.map = undefined;
    }

    /**
     * Choose the right type of map when it hasn't already been set
     */
    private autoBuildMap() {
        if (this.location === 'doors') { // in town
            this.map = new HMapGridMap(this);
            this.map.mode = 'global'; // in town, we can see the global mode, not perso
        } else if (this.location === 'desert') {
            this.map = new HMapDesertMap(this);
        } else if (this.location === 'ruin') {
            this.map = new HMapRuin(this);
        } else {
            throw new Error('HMap::autoBuildMap - could not detect location');
        }
    }
}
