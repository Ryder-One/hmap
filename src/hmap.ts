import { HMapTypeMapStr, HMapTypeSVGMap } from './maps/abstract';
import { Environment } from './environment';
import { HMapDataJSON, HMapData } from './hmap-data';
import { HMapGridMap } from './maps/grid';
import { HMapDesertMap } from './maps/desert';

export interface HMapPoint {
    x: number;
    y: number;
}

export interface HMapSize {
    width: number;
    height: number;
}

export type HMapLocation = 'doors' | 'desert' | 'ruin' | 'unknown';

declare var js: any; // haxe stuff

export class HMap {

    private map?: HMapTypeSVGMap;

    public width = 300; // for debug only, the value is 300 and there is a lot of hard coded values
    public height = 300; // for debug only, the value is 300 and there is a lot of hard coded values
    public displayFlashMap = false;

    // little green arrow target
    public target?: HMapPoint;

    public originalOnData?: CallableFunction;
    public location?: HMapLocation;

    constructor() { }

    /**
     * Get the map data and launch the drawing of the map
     * This method is not straightfoward. It handles debug mode,
     * and the fact the data can be outdated in the HTML (initialized)
     * but uptodate in the store
     * @param forceData when passed, it will use this dataset instead of
     * fetching the HTML
     */
    fetchMapData(forceData?: HMapDataJSON) {
        if (this.map === undefined) {
            this.autoBuildMap();
        }

        if (Environment.getInstance().devMode === true) { // if we are in dev mode, serve a json
            // this is a bit messed up but I didnt anticipated the debug mode
            this.map!.buildLayers();
            if (forceData === undefined) {
                forceData = HMapData.fakeData();
            } else {
                HMapData._fakeData = forceData; // save the fake data for the future
            }
            this.map!.completeDataReceived({ JSON: forceData }); // if undefined, then it will fake the data

        } else { // production mode
            if (forceData) {
                this.map!.buildLayers();
                this.map!.completeDataReceived({ JSON: forceData });
            } else { // fetch from the HTML
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
        }

    }

    /**
     * Function used to setup the interceptor.
     * The interceptor will intercept data from the server, inform our map
     * and pass it back to haxe.
     */
    setupInterceptor() {

        let _js;
        // @ts-ignore this thing is not known by the TS compiler
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
        if (data.indexOf('js.JsMap.init') !== -1 || data.indexOf('mapLoader.swf') !== -1) {
            // if we changed location or we dont have jsmap.init in the message, reload the whole map
            if (currentLocation !== this.location || data.indexOf('mapLoader.swf') !== -1) {
                this.location = currentLocation;
                this.clearMap();
                this.fetchMapData(); // it will autobuild the map
            } else { // we are still on the same location
                if (data.indexOf('js.JsMap.init') !== -1) {
                    const startVar = data.indexOf('js.JsMap.init') + 16;
                    const stopVar = data.indexOf('\',', startVar);
                    const tempMapData = data.substring(startVar, stopVar);
                    this.map!.partialDataReceived({ raw: tempMapData }); // else just patch the data
                } else {
                    console.warn('HMap::dataInterceptor - this case hasn\'t been encoutered yet');
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
        }
        this.fetchMapData(store);
    }

    /**
     * Rebuild the map with the JSON passed in argument. For debug mode only
     */
    reloadMapWithData(data: HMapDataJSON) {
        this.clearMap();
        this.target = undefined;
        this.fetchMapData(data);
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
        if (this.map !== undefined) {
            // this.map.stopAnimation();
            this.map = undefined;
        }
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
            return; // @TODO
        } else {
            throw new Error('HMap::fetchMapData - could not detect location');
        }
    }
}
