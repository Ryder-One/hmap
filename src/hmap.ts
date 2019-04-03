import { HMapArrow, HMapArrowDirection } from './arrow';
import { HMapData, HMapDataJSON } from './hmap-data';
import { HMapBackgroundLayer } from './layers/background';
import { HMapLayerType } from './layers/abstract';
import { HMapForegroundLayer } from './layers/foreground';
import { HMapBufferLayer } from './layers/buffer';
import { HMapImagesLoader } from './imagesLoader';
import { HMapNeighbour } from './neighbours';

declare var js: any; // haxe stuff
declare var haxe: any; // haxe stuff

interface HMapParallax {
    x: number;
    y: number;
}

export interface HMapPoint {
    x: number;
    y: number;
}

export interface HMapSize {
    width: number;
    height: number;
}

export class HMap {

    private jQ: JQueryStatic;
    private devMode = false;
    private layers = new Map<HMapLayerType, HMapBackgroundLayer|HMapForegroundLayer|HMapBufferLayer>();
    private parallax: HMapParallax = { x: 0, y: 0 };
    private animationLoopId?: number; // hold the request animation frame id

    public imagesLoader = new HMapImagesLoader();
    public mapData?: HMapData;
    public registredArrows = new Array<HMapArrow>();

    // variables to do the translation on arrow click
    private startTranslate?: number; // timestamp
    private translateTo: HMapParallax = { x: 0, y: 0 };

    private originalOnData?: CallableFunction;

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

        this.buildLayers(); // create the HTML for the layers

        if (this.devMode === true) { // if we are in dev mode, serve a json

            this.jQ.getJSON('mapData.json.pti', {
                format: 'json'
            }).done((_mapData) => {
                this.setJSONData(_mapData); // it will start the drawing automatically
            });

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

                    this.setRawData(tempMapData); // it will start the drawing automatically

                } else if (++counterCheckExists === 100) {
                    clearInterval(checkExist); // timeout 10sec
                }
            }, 100); // 10 sec then give up
        }

    }

    /**
     * Append the HTML with jQuery. It is safe to recall this method (wont append twice)
     */
    private buildLayers() {
        // inject some HTML to make room for the map
        this.jQ('.swf').css('display', 'flex').css('flex-direction', 'column').css('height', 'auto');
        if (!this.jQ('#hmap').length) {
            this.jQ('.swf').append('<div id="hmap"></div>');
            this.jQ('#hmap').css('height', '300px');
        }

        this.layers.set('background', new HMapBackgroundLayer(this.jQ, this));

        const FGLayer = new HMapForegroundLayer(this.jQ, this);
        this.layers.set('foreground', FGLayer);
        FGLayer.canvas.onmousemove = this.onMouseMove.bind(this);
        FGLayer.canvas.onmouseleave = this.onMouseLeave.bind(this);
        FGLayer.canvas.onclick = this.onMouseClick.bind(this);

        this.layers.set('buffer', new HMapBufferLayer(this.jQ, this));
    }

    /**
     * Utility function to have a nice start/stop animation
     */
    startAnimation() {
        if (!this.animationLoopId) {
            this.animationLoopId = window.requestAnimationFrame(this.animationLoop.bind(this));
        }
    }

    stopAnimation() {
        if (this.animationLoopId) {
           window.cancelAnimationFrame(this.animationLoopId);
           this.animationLoopId = undefined;
        }
    }

    /**
     * The main animation loop; used for parallax effect and to emulate mouse behavior on arrows layer
     */
    private animationLoop() {
        this.animationLoopId = undefined;

        // const buffer = this.layers.get('buffer')!;
        const background = this.layers.get('background')!;
        const fg = this.layers.get('foreground')!;

        let coef = 1;
        if (this.startTranslate) {
            const p = (Date.now() - this.startTranslate) / 300; // 300ms
            coef = p === 1 ? 1 : 1 - Math.pow(2, - 10 * p); // exp easing
            if (coef >= 1) { // the motion is over, reset the variables
                this.startTranslate = undefined;
            }
        }

        const translateX = this.translateTo.x + this.parallax.x;
        const translateY = this.translateTo.y + this.parallax.y;

        background.ctx.save();
        background.ctx.translate(translateX * coef, translateY * coef);
        background.draw();
        background.ctx.restore();

        // background.ctx.drawImage(buffer.canvas, 0, 0);
        fg.draw();
        this.startAnimation();
    }

    /**
     * It will set the data read from flashvar and bootstrap the drawing
     */
    private setRawData(rawData: any) {
        this.mapData = new HMapData(rawData);
        this.completeDataReceived();
    }

    /**
     * It will set the data from a JSON and bootstrap the drawing
     */
    private setJSONData(jsonData: HMapDataJSON) {
        this.mapData = new HMapData(null, jsonData);
        this.completeDataReceived();
    }

    /**
     * Called when the map data has been set or totally modified
     * This is the intialization function
     */
    private completeDataReceived() {
        this.imagesLoader.registerBuildingsToPreload(this.mapData!.neighbours);

        this.registerArrows();

        const loading = new Image();
        loading.src = this.imagesLoader.get('loading').src;
        loading.onload = () => {
            const bgCtx = this.layers.get('background')!.ctx;
            bgCtx.drawImage(loading, 0, 0);

            // when preloading the pictures is finished, starts drawing
            this.imagesLoader.preloadPictures(bgCtx, () => {
                this.startAnimation();
            });

        };
    }

    /**
     * Called when a small part of the mapData (_r) has been updated
     */
    private partialDataReceived(tempData: any) {
        // dont forget to rebuild the neighbours
        this.mapData!.buildNeighbours();

        // the position has changed, the arrows may be different
        this.registerArrows();

        // stop the animation to preload the pictures
        this.stopAnimation();

        this.imagesLoader.registerBuildingsToPreload(this.mapData!.neighbours);
        this.imagesLoader.preloadPictures(null, () => {
            this.startAnimation(); // re launch the animation
        });
    }

    /**
     * Function called when the user click on a directionnal arrow
     */
    private move(direction: HMapArrowDirection) {

        let x: number, y: number;
        if (direction === 'right') {
            x = 1; y = 0;
        } else if (direction === 'left') {
            x = -1; y = 0;
        } else if (direction === 'top') {
            x = 0; y = -1;
        } else {
            x = 0; y = 1;
        }

        this.startTranslate = Date.now();
        this.translateTo = { x: -100 * x, y: -100 * y};

        // this is a real timeout (300ms), not a fake async method
        setTimeout(() => {

            // move the position
            this.mapData!.movePosition(x, y);

            // reset the animation
            this.translateTo = { x: 0, y: 0};

            if (this.devMode === false) {
                const url = 'outside/go?x=' + x + ';y=' + y + ';z=' + this.mapData!.zoneId + js.JsMap.sh;
                const r = new haxe.Http('/' + url);
                js.XmlHttp.onStart(r);
                js.XmlHttp.urlForBack = url;
                r.setHeader('X-Handler', 'js.XmlHttp');
                r.onData = (data: string) => {

                    if (data.indexOf('<load>outside') !== -1) { // in town
                        // tslint:disable-next-line
                        location.reload(true); // I dont have a better idea atm
                    } else {

                        const startVar = data.indexOf('js.JsMap.init') + 16;
                        const stopVar = data.indexOf('\',', startVar);
                        const tempMapData = data.substring(startVar, stopVar);

                        // patch the store with new data
                        this.mapData!.patchDataRaw(tempMapData);

                        this.partialDataReceived(tempMapData);

                        this.originalOnData!(data); // we are sure it has been set
                    }
                };

                r.onError = js.XmlHttp.onError;
                r.request(false);
            } else {

                const newIndex = this.mapData!.index;

                // fake the move with already known data
                const fakeData = {
                    _neigDrops: [],
                    _neig: [],
                    _state: false,
                    _c: (this.mapData!.data._details[newIndex]._c) ? this.mapData!.data._details[newIndex]._c : 0,
                    _h: 0,
                    _m: 6,
                    _t: 0,
                    _z: (this.mapData!.data._details[newIndex]._z) ? this.mapData!.data._details[newIndex]._z : 0,
                    _zid: 42424545
                };

                // patch the store with new data
                this.mapData!.patchDataJSON(fakeData);

                this.partialDataReceived(fakeData);
            }
        }, 300);
    }

    private onMouseMove(e: MouseEvent) {
        if (e.target) {
            const canvas = e.target as HTMLCanvasElement;
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            const centerX = 150;
            const centerY = 150;

            this.parallax.x = (centerX - mouseX) / 10;
            this.parallax.y = (centerY - mouseY) / 10;

            // mouseover the arrows
            let overOne = false;
            for (let i = 0, j = this.registredArrows.length; i < j; i++) {
                const arrowRegistred = this.registredArrows[i];
                if (mouseX > arrowRegistred.rx &&
                    mouseX < ( arrowRegistred.rx + arrowRegistred.w) &&
                    mouseY > arrowRegistred.ry &&
                    mouseY < ( arrowRegistred.ry + arrowRegistred.h) ) {
                    arrowRegistred.over = true;
                    overOne = true;
                    break; // we cannot be over two arrows
                } else {
                    arrowRegistred.over = false;
                }
            }

            if (overOne === true) {
                canvas.style.cursor = 'pointer';
            } else {
                canvas.style.cursor = 'auto';
            }
        }
    }

    private onMouseClick(e: MouseEvent) {
        if (e.target) {
            const canvas = e.target as HTMLCanvasElement;
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            for (let i = 0, j = this.registredArrows.length; i < j; i++) {
                const arrowRegistred = this.registredArrows[i];
                // if we clicked in the square of a directionnal arrow
                if (mouseX > arrowRegistred.rx &&
                    mouseX < ( arrowRegistred.rx + arrowRegistred.w) &&
                    mouseY > arrowRegistred.ry &&
                    mouseY < ( arrowRegistred.ry + arrowRegistred.h) ) {
                    this.move(this.registredArrows[i].t);
                }
            }
        }
    }

    /**
     * When the mouse leave the map, reset some variables
     */
    private onMouseLeave() {

        this.parallax.x = 0;
        this.parallax.y = 0;
        for (let n = 0, p = this.registredArrows.length; n < p; n++) {
            this.registredArrows[n].over = false;
        }
    }

    /**
     * Register the available directionnal arrows
     */
    private registerArrows() {
        this.registredArrows = new Array<HMapArrow>();
        if (this.mapData) {
            if (this.mapData.actionPoints > 0) { // if we can move
                this.mapData.neighbours.neighbours.forEach((neighbour: HMapNeighbour) => {
                    let offsetY, offsetX;
                    if (neighbour.outbounds === false) { // not on the edge of the map
                        if (neighbour.position === 'top_center') {
                            offsetY = 15;
                            offsetX = - 41 + 150;
                            const A = new HMapArrow(offsetX, offsetY, offsetX, offsetY, 83, 28 , 'top', 0, false);
                            this.registredArrows.push(A);
                        } else if (neighbour.position === 'bottom_center') {
                            offsetY = 250;
                            offsetX = - 41 + 150;
                            const A = new HMapArrow(offsetX, offsetY, offsetX, offsetY, 83, 28 , 'bottom', 180, false);
                            this.registredArrows.push(A);
                        } else if (neighbour.position === 'middle_right') {
                            offsetX = 230;
                            offsetY = - 14 + 150;
                            const A = new HMapArrow(offsetX, offsetY, offsetX + 27, offsetY - 27, 28, 83 , 'right', 90, false);
                            this.registredArrows.push(A);
                        } else if (neighbour.position === 'middle_left') {
                            offsetX = -10;
                            offsetY = - 14 + 150;
                            const A = new HMapArrow(offsetX, offsetY, offsetX + 27, offsetY - 27, 28, 83 , 'left', 270, false);
                            this.registredArrows.push(A);
                        }
                    }
                });
            }
        }
    }

    /**
     * Function used to setup the interceptor.
     * The interceptor will intercept data from the server, inform our map
     * and pass it back to haxe.
     */
    public setupInterceptor() {
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
    public dataInterceptor(data: any) {

        console.log(data);

        if (data.indexOf('js.JsMap.init') !== -1) {
            const startVar = data.indexOf('js.JsMap.init') + 16;
            const stopVar = data.indexOf('\',', startVar);
            const tempMapData = data.substring(startVar, stopVar);

            console.log(startVar, stopVar, tempMapData);

            // patch the store with new data
            this.mapData!.patchDataRaw(tempMapData);

            this.partialDataReceived(tempMapData);

        }
        this.originalOnData!(data);
    }
}
