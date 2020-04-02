import { HMapTypeMapStr, HMapTypeSVGMap } from './maps/abstract';
import { HMapGridMap } from './maps/grid';
import { HMapDesertMap } from './maps/desert';
import { HMapRuin } from './maps/ruin';
import { Log } from './log';

const logger = Log.get('HMap');

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
        logger.enter('fetchMapData');
        if (this.map === undefined) {
            logger.log('Map is undefined, start autobuild');
            this.autoBuildMap();
        }

        // We will look for the flashmap, take the data, and bootstrap our map
        logger.log('Look for the flash data in the HTML code');
        let counterCheckExists = 0;
        const checkExist = setInterval(() => {
            logger.enter('fetchMapData::setInterval');
            if (document.querySelector('#swfCont') !== null) {
                logger.log('Swfcontainer has been found');
                clearInterval(checkExist);

                let tempMapData;
                if (document.querySelector('#FlashMap') !== null || document.querySelector('#FlashExplo') !== null) { // if the flashmap is there
                    logger.log('Flash is enabled on browser, flashmap/explo has been found, map data selected');

                    let HTMLName = 'FlashMap';
                    if (document.querySelector('#FlashExplo') !== null) {
                        HTMLName = 'FlashExplo';
                    }

                    const node  = document.querySelector('#' + HTMLName);
                    if(node!.nodeName.toUpperCase() === 'OBJECT') {
                        tempMapData = document.querySelector('#' + HTMLName + ' param[name="flashvars"]')!.getAttribute('value')!.substring(13);

                    } else {
                        tempMapData = node!.getAttribute('flashvars')!.substring(13);
                    }
                } else { // if this is only the JS code supposed to bootstrap flash
                    if (document.querySelector('#gameLayout') !== null) {
                        logger.log('Flash seems disabled on this browser, go fetch the code supposed to bootstrap flash');
                        const scriptStr = document.querySelector('#gameLayout')!.innerHTML;
                        logger.log('Look for desert map');
                        let mapMarker = scriptStr.indexOf('mapLoader.swf');

                        if (mapMarker === -1) {
                            logger.log('Desert map not found, look for ruin map');
                            mapMarker = scriptStr.indexOf('exploLoader.swf');
                        }
                        if (mapMarker === -1) {
                            logger.log('No map found');
                            logger.leave('fetchMapData::setInterval');
                            return;
                        }
                        const startVar = scriptStr.indexOf('data', mapMarker) + 8;
                        const stopVar = scriptStr.indexOf('\');', startVar);
                        tempMapData = scriptStr.substring(startVar, stopVar);
                        logger.log(startVar, stopVar, tempMapData);
                        logger.log('Encoded data found');
                    }
                }
                logger.log('Build map layers');
                this.map!.buildLayers();
                logger.log('Send the encoded data to the map');
                this.map!.completeDataReceived({raw: tempMapData});

            } else if (++counterCheckExists === 100) {
                logger.log('Timeout, no flash data were found, stop fetchMapData');
                clearInterval(checkExist); // timeout 10sec
            }
            logger.leave('fetchMapData::setInterval');
        }, 100); // 10 sec then give up
        logger.leave('fetchMapData');
    }

    /**
     * Function used to setup the interceptor.
     * The interceptor will intercept data from the server, inform our map
     * and pass it back to haxe.
     */
    setupInterceptor() {
        logger.enter('setupInterceptor');
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
            logger.log('Bind datainterceptor');
            _js.XmlHttp.onData = this.dataInterceptor.bind(this);
        } else {
            throw new Error('HMap::setupInterceptor - Cannot find js.XmlHttp.onData');
        }
        logger.leave('setupInterceptor');
    }

    /**
     * Actual interceptor
     */
    dataInterceptor(data: string) {
        logger.enter('dataInterceptor');
        this.originalOnData!(data); // call the original method first

        const currentLocation = this.getCurrentLocation();
        logger.log('Current location is ', currentLocation);
        if (currentLocation === 'unknown') { // unknown location, make sure HMap is removed from the DOM
            this.location = 'unknown';
            logger.log('Unknown location, clear the map');
            this.clearMap();
            logger.leave('dataInterceptor');
            return;
        }

        // now we are in an interesting place for us, check if there is data for our map
        if (data.indexOf('js.JsMap.init') !== -1 ||
            data.indexOf('js.JsExplo.init') !== -1 ||
            data.indexOf('mapLoader.swf') !== -1 ||
            data.indexOf('exploLoader.swf') !== -1) {
            logger.log('Interesting elements have been found');
            // if we changed location or we dont have jsmap.init in the message, reload the whole map
            if (currentLocation !== this.location || data.indexOf('mapLoader.swf') !== -1 || data.indexOf('exploLoader.swf') !== -1) {
                logger.log('The location has changed or the swf keywords have been found');
                this.location = currentLocation;
                logger.log('Clear the map');
                this.clearMap();
                logger.log('Fetch the data');
                this.fetchMapData(); // it will autobuild the map
            } else { // we are still on the same location
                if (data.indexOf('js.JsMap.init') !== -1 || data.indexOf('js.JsExplo.init') !== -1) {
                    logger.log('js.xxx.init code has been found');
                    let startVar = 0;
                    if (data.indexOf('js.JsMap.init') !== -1) {
                        startVar = data.indexOf('js.JsMap.init') + 16;
                        logger.log('from the JsMap tag', startVar);
                    } else {
                        startVar = data.indexOf('js.JsExplo.init') + 18;
                        logger.log('from the JsExplo tag', startVar);
                    }
                    const stopVar = data.indexOf('\',', startVar);
                    const tempMapData = data.substring(startVar, stopVar);
                    logger.log('Encoded data extracted from the message, send it to the map');
                    this.map!.partialDataReceived({ raw: tempMapData }); // just patch the data
                } else {
                    logger.warn('this case hasn\'t been encoutered yet', data);
                }
            }
        }
        logger.leave('dataInterceptor');
    }

    /**
     * Guess on what page we are (outise or inside the town ) by parsing the URL
     */
    getCurrentLocation(): HMapLocation {
        logger.enter('getCurrentLocation');
        if (window.location.href.indexOf('outside') !== -1) {
            logger.log('"outside" detected in URL, load the desert map');
            logger.leave('getCurrentLocation');
            return 'desert';
        } else if (window.location.href.indexOf('door') !== -1) {
            logger.log('"door" detected in URL, load the desert map in grid mode');
            logger.leave('getCurrentLocation');
            return 'doors';
        } else if (window.location.href.indexOf('explo') !== -1) {
            logger.log('"explo" detected in URL, load the ruin map');
            logger.leave('getCurrentLocation');
            return 'ruin';
        } else {
            logger.log('No location detected, return unknown');
            logger.leave('getCurrentLocation');
            return 'unknown';
        }
    }

    /**
     * Switch the map to a new type and reload
     */
    switchMapAndReload(type: HMapTypeMapStr) {
        logger.enter('switchMapAndReload');
        const store = this.map!.mapData!.data;
        logger.log('Clear the map');
        this.clearMap();
        logger.log('Load the new map depending on the type');
        if (type === 'desert') {
            logger.log('Type = desert, create a new desert map');
            this.map = new HMapDesertMap(this);
        } else if (type === 'grid') {
            logger.log('Type = grid, create a new grid map');
            this.map = new HMapGridMap(this);
        } else if (type === 'ruin') {
            logger.log('Type = ruin, create a new ruin map');
            this.map = new HMapRuin(this);
        }
        logger.log('Build the layers');
        this.map!.buildLayers();
        logger.log('Load the data');
        this.map!.completeDataReceived({ JSON: store });
        logger.leave('switchMapAndReload');
    }

    /**
     * Rebuild the map with the JSON passed in argument. For debug mode only
     */
    reloadMapWithData(data?: any) { // @TODO fix the any ?
        logger.enter('reloadMapWithData');
        logger.log('Start by clearing the map');
        this.clearMap();
        this.target = undefined;
        logger.log('Then rebuild it');
        this.autoBuildMap();
        this.map!.buildLayers();
        this.map!.completeDataReceived({ JSON: data });
        logger.leave('reloadMapWithData');
    }

    /**
     * Clear the map to draw a new one (when we switch the map from desert to grid, etc.)
     */
    private clearMap(): void {
        logger.enter('clearMap');
        // destroy the dom element
        const hmap = document.querySelector('#hmap');
        logger.log('destroy the DOM element');
        if (hmap !== null && hmap.parentNode !== null) {
            hmap.parentNode.removeChild(hmap);
        }
        // unset the objects
        this.map = undefined;
        logger.log('unset map object');
        logger.leave('clearMap');
    }

    /**
     * Choose the right type of map when it hasn't already been set
     */
    private autoBuildMap() {
        logger.enter('autoBuildMap');
        if (this.location === 'doors') { // in town
            this.map = new HMapGridMap(this);
            this.map.mode = 'global'; // in town, we can see the global mode, not perso
            logger.log('Location is "doors", build the grid map in "doors" mode');
        } else if (this.location === 'desert') {
            this.map = new HMapDesertMap(this);
            logger.log('Location is "desert", build the desert map');
        } else if (this.location === 'ruin') {
            this.map = new HMapRuin(this);
            logger.log('Location is "ruin", build the ruin map');
        } else {
            throw new Error('HMap::autoBuildMap - could not detect location');
        }
        logger.leave('autoBuildMap');
    }
}
