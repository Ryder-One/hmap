import { HMapDesertMap } from './maps/desert';
import { HMapGridMap } from './maps/grid';
import { HMapTypeMap, HMapTypeMapStr } from './maps/abstract';

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

    private jQ: JQueryStatic;
    private devMode = false;

    private originalOnData?: CallableFunction;
    private map?: HMapTypeMap;

    public location?: HMapLocation;

    constructor(jQ: JQueryStatic, devMode?: boolean) {

        this.jQ = jQ;
        if (devMode !== undefined) {
            this.devMode = devMode;
        }
    }

    /**
     * Get the map data and launch the drawing of the map
     */
    fetchMapData() {
        console.log('fetchMapData');

        if (this.map === undefined) {
            this.autoBuildMap();
        }

        if (this.devMode === true) { // if we are in dev mode, serve a json

            this.map!.buildLayers();
            this.map!.completeDataReceived(); // no data passed = fake the data

        } else {
            // We will look for the flashmap, take the data, and bootstrap our map
            let counterCheckExists = 0;
            const checkExist = setInterval(() => {
                if (this.jQ('#swfCont').length) {
                    clearInterval(checkExist);

                    let tempMapData;
                    if (this.jQ('#FlashMap').length) { // if the flashmap is there
                        tempMapData = this.jQ('#FlashMap').attr('flashvars')!.substring(13);
                    } else { // if this is only the JS code supposed to bootstrap flash
                        const scriptStr = this.jQ('#parsed_1').html();
                        const startVar = scriptStr.indexOf('data') + 8;
                        const stopVar = scriptStr.indexOf('\');', startVar);
                        tempMapData = scriptStr.substring(startVar, stopVar);
                    }
                    this.map!.buildLayers();
                    this.map!.completeDataReceived(tempMapData);

                } else if (++counterCheckExists === 100) {
                    clearInterval(checkExist); // timeout 10sec
                }
            }, 100); // 10 sec then give up
        }

    }

    /**
     * Function used to setup the interceptor.
     * The interceptor will intercept data from the server, inform our map
     * and pass it back to haxe.
     */
    setupInterceptor() {
        if (js && js.XmlHttp && js.XmlHttp.onData) {
            this.originalOnData = js.XmlHttp.onData;
            js.XmlHttp.onData = this.dataInterceptor.bind(this);
        } else {
            throw new Error('HMap::setupInterceptor - Cannot find js.XmlHttp.onData');
        }
    }

    /**
     * Actual interceptor
     */
    dataInterceptor(data: string) {

        this.originalOnData!(data);

        console.log('HMap interceptor - ', this.getCurrentLocation(), this.location);

        const currentLocation = this.getCurrentLocation();
        if (currentLocation === 'unknown') { // unknown location, make sure the HMap is removed from the DOM
            this.location = 'unknown';
            this.jQ('#hmap').remove();
            return;
        }

        // now we are in an interesting place for us, check if there is data for our map
        if (data.indexOf('js.JsMap.init') !== -1 || data.indexOf('mapLoader.swf') !== -1) {
            if (currentLocation !== this.location) { // if we changed location, reload the whole map
                this.location = currentLocation;
                this.fetchMapData();
            } else { // we are still on the same location
                if (data.indexOf('js.JsMap.init') !== -1) {
                    const startVar = data.indexOf('js.JsMap.init') + 16;
                    const stopVar = data.indexOf('\',', startVar);
                    const tempMapData = data.substring(startVar, stopVar);
                    this.map!.partialDataReceived({raw: tempMapData}); // else just patch the data
                } else {
                    console.warn('HMap::dataInterceptor - this case hasn\'t been encoutered yet' );
                }
            }
        }
    }

    /**
     * Guess on what page we are (town, desert, ruin.. ) by parsing the HTML
     */
    getCurrentLocation(): HMapLocation {
        if (window.location.href.indexOf('door') !== -1) {
            return 'doors';
        } else if (window.location.href.indexOf('outside') !== -1) {
            return 'desert';
        } else {
            console.log(window.location.href);
            return 'unknown';
        }
    }

    /**
     * Switch the map to a new type and reload
     */
    switchMapAndReload(type: HMapTypeMapStr) {
        this.jQ('#hmap').remove();
        if (type === 'desert') {
            this.map = new HMapDesertMap(this.jQ, this, this.devMode);
        } else if (type === 'grid') {
            this.map = new HMapGridMap(this.jQ, this, this.devMode);
        }
        this.fetchMapData();
    }

    /**
     * Choose the right type of map when it hasn't already been set
     */
    private autoBuildMap() {
        if (this.location === 'doors') { // in town
            this.map = new HMapGridMap(this.jQ, this, this.devMode);
            this.map.mode = 'global'; // in town, we can see the global mode, not perso
        } else if (this.location === 'desert') {
            this.map = new HMapDesertMap(this.jQ, this, this.devMode);
        } else if (this.location === 'ruin') {
            return; // @TODO
        } else {
            throw new Error('HMap::fetchMapData - could not detect location');
        }
    }
}
