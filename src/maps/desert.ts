import { HMapAbstractMap } from './abstract';
import { HMapArrow, HMapArrowDirection } from '../arrow';
import { HMapBackgroundLayer } from '../layers/background';
import { HMapForegroundLayer } from '../layers/foreground';
import { HMapBufferLayer } from '../layers/buffer';
import { HMapNeighbour } from '../neighbours';

declare var haxe: any;
declare var js: any;

interface HMapParallax {
    x: number;
    y: number;
}

export class HMapDesertMap extends HMapAbstractMap {

    private parallax: HMapParallax = { x: 0, y: 0 };

    public registredArrows = new Array<HMapArrow>();

    // variables to do the translation on arrow click
    private startTranslate?: number; // timestamp
    private translateTo: HMapParallax = { x: 0, y: 0 };

    private originalOnData?: CallableFunction;

    constructor(jQ: JQueryStatic, devMode?: boolean) {
        super(jQ, devMode);
    }

    /**
     * Append the HTML with jQuery. It is safe to recall this method (it wont append layers twice)
     */
    public buildLayers(): void {
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

        // this is a test : just append this one and keep all the others "virtual"
        // ie: in the DOM but not displayed. Can be usefull to make effects like
        // the distortion or the static effect at the end of the animation
        // this is not used at the moment
        this.layers.set('buffer', new HMapBufferLayer(this.jQ, this));
    }

    /**
     * The main animation loop; used for parallax effect and to emulate mouse behavior on the foreground layer
     */
    protected animationLoop(): void {
        const background = this.layers.get('background')!;
        const fg = this.layers.get('foreground')!;

        // translation effect when we click on an arrow
        let coef = 1; // this will be increasing from 0 to 1
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

        fg.draw(); // we need to redraw the foreground to simulate the roll over effect on arrows

        // reloop
        this.animationLoopId = undefined;
        this.startAnimation();
    }

    /**
     * When new data arrive, rebuild the arrows
     */
    protected onDataReceived(init: boolean): void {
        this.registerArrows();

        this.imagesLoader.registerBuildingsToPreload(this.mapData!.neighbours);

        let firstCtx = null; // loading bar when the phase is initialisation
        if (init === true) {
            firstCtx = this.layers.values().next().value.ctx; // take the ctx of the first layer
        }

        // when preloading the pictures is finished, starts drawing
        this.imagesLoader.preloadPictures(firstCtx, () => {
            this.startAnimation();
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

                        this.partialDataReceived({raw: tempMapData});

                        this.originalOnData!(data); // we are sure it has been set
                    }
                };

                r.onError = js.XmlHttp.onError;
                r.request(false);
            } else { // dev mode, fake the data

                const newIndex = this.mapData!.index;

                // fake the move with already known data
                const fakeData = {
                    _neigDrops: [],
                    _neig: new Array(),
                    _state: false,
                    _c: (this.mapData!.data._details[newIndex]._c) ? this.mapData!.data._details[newIndex]._c : 0,
                    _h: 0,
                    _m: 6,
                    _t: 0,
                    _z: (this.mapData!.data._details[newIndex]._z) ? this.mapData!.data._details[newIndex]._z : 0,
                    _zid: 42424545
                };

                if (newIndex - this.mapData!.size.height > 0) {
                    fakeData._neig.push(this.mapData!.data._details[newIndex - this.mapData!.size.height]._z);
                } else {
                    fakeData._neig.push(0);
                }
                if (newIndex + 1 < (this.mapData!.size.width * this.mapData!.size.height) ) {
                    fakeData._neig.push(this.mapData!.data._details[newIndex + 1]._z);
                } else {
                    fakeData._neig.push(0);
                }
                if (newIndex + this.mapData!.size.height < (this.mapData!.size.height * this.mapData!.size.height) ) {
                    fakeData._neig.push(this.mapData!.data._details[newIndex + this.mapData!.size.height]._z);
                } else {
                    fakeData._neig.push(0);
                }
                if (newIndex - 1 > 0 ) {
                    fakeData._neig.push(this.mapData!.data._details[newIndex - 1]._z);
                } else {
                    fakeData._neig.push(0);
                }

                this.partialDataReceived({JSON: fakeData});
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
}
