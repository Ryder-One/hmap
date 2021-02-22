import { HMapAbstractMap } from './abstract';
import { HMapLang } from '../lang';
import { HMapSVGRuinBackgroundLayer } from '../layers/svg-ruin-background';
import { HMapSVGLoadingLayer } from '../layers/svg-loading';
import { Toast } from '../toast';
import { HMapRuinDataJSON, HMapRuinLocalDataJSON, HMapRuinData, HMapRuinRoomJSON } from '../data/hmap-ruin-data';
import { HMapDataPayload } from '../data/abstract';
import { HMapArrowDirection, HMapArrow } from '../arrow';
import { Environment } from '../environment';
import { HMapRandom } from '../random';
import { HMapSVGRuinForegroundLayer } from '../layers/svg-ruin-foreground';
import { HMapImagesLoader } from '../imagesLoader';

declare let haxe: any;
declare let js: any;

export type HMapRuinType = 'motel' | 'bunker' | 'hospital';

export class HMapRuin extends HMapAbstractMap<HMapRuinDataJSON, HMapRuinLocalDataJSON> {

    public type?: HMapRuinType;
    public registredArrows = new Array<HMapArrow>();
    public oxygen = 100;
    private moving = false;
    private oxygenTimer?: number;

    /**
     * Build the layers (SVG) for this map
     */
    public buildLayers(): void {

        const swf = document.querySelector(this.hmap.cssSelector);

        if (swf !== null) {
            swf.setAttribute('style', 'display:flex;flex-direction:column;height:auto');

            // if (this.hmap.displayFlashMap === false) {
            const originalMap = document.querySelector('#swfCont') as HTMLElement;
            if (originalMap) {
                originalMap.style.display = 'none';
            }
            // }

            if (document.querySelector('#hmap') === null) {
                const hmap = document.createElement('div');
                hmap.setAttribute('id', 'hmap');
                hmap.setAttribute('style', 'width:' + this.width + 'px;height:' + this.height + 'px;position:relative');
                swf.appendChild(hmap);

                // create the menu
                const hmapMenu = document.createElement('div');
                hmapMenu.setAttribute('id', 'hmap-menu');
                hmapMenu.setAttribute('style', 'position:absolute;bottom:0px;z-index:999;height:20px;display:none');
                hmap.appendChild(hmapMenu);

                const debugButton = document.createElement('div');
                debugButton.setAttribute('id', 'hmap-debug-button');
                debugButton.setAttribute('class', 'hmap-button');
                debugButton.innerHTML = HMapLang.get('debugbutton');
                hmapMenu.appendChild(debugButton);
                debugButton.onclick = this.onDebugButtonClick.bind(this);

                // style the buttons
                const buttons = document.querySelectorAll('.hmap-button');
                buttons.forEach((el) => {
                    (el as HTMLElement).onmouseleave = (e: MouseEvent) => {
                        (e.target as HTMLElement).style.outline = '0px';
                    };
                    (el as HTMLElement).onmouseenter = (e: MouseEvent) => {
                        (e.target as HTMLElement).style.outline = '1px solid #eccb94';
                    };
                });

                hmapMenu.style.display = 'none';
            }

            const RuinBGLayer = new HMapSVGRuinBackgroundLayer(this);
            this.layers.set('ruin-background', RuinBGLayer);

            const RuinFGLayer = new HMapSVGRuinForegroundLayer(this);
            this.layers.set('ruin-foreground', RuinFGLayer);

            const LoadingLayer = new HMapSVGLoadingLayer(this);
            this.layers.set('loading', LoadingLayer);
        }
    }

    /**
     * Function called when the user click on a directionnal arrow
     * The function is big because of to the debug mode
     */
    move(direction: HMapArrowDirection) {

        const mapData = this.mapData as HMapRuinData;

        // since the move is happening in a setTimeout, we have to do this boolean trick to avoid double move
        if (this.moving === true) {
            return;
        }
        this.moving = true;

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

        const ruinLayer = this.layers.get('ruin-background') as HMapSVGRuinBackgroundLayer;

        if (Environment.getInstance().devMode === false) {
            const url = 'explo/move?x=' + x + ';y=' + y + ';z=' + mapData.zoneId + js.JsExplo.sh;

            let hx: any;

            // @ts-ignore
            const page: any = window.wrappedJSObject;
            if (page !== undefined && page.haxe) { // greasemonkey ...
                hx = page.haxe;
            } else if (haxe) { // tampermonkey
                hx = haxe;
            }

            const r = new hx.Http('/' + url);
            js.XmlHttp.onStart(r);
            js.XmlHttp.urlForBack = url;
            r.setHeader('X-Handler', 'js.XmlHttp');
            r.onData = (data: string) => {
                this.hmap.originalOnData!(data); // we are sure the function has been set

                ruinLayer.easeMovement({ x: 300 * x, y: 300 * y }, () => {
                    if (data.indexOf('js.JsExplo.init') !== -1) {
                        const startVar = data.indexOf('js.JsExplo.init') + 18;
                        const stopVar = data.indexOf('\',', startVar);
                        const tempMapData = data.substring(startVar, stopVar);

                        this.partialDataReceived({ raw: tempMapData });
                    }

                    this.moving = false; // allow another move
                });
            };

            r.onError = js.XmlHttp.onError;
            r.request(false);

        } else { // dev mode, fake the data

            let exit = false;
            if ( (mapData.position.x + x) === 7 && (mapData.position.y + y) === 0) {
                exit = true;
            }

            // fake the move with already known data
            const seed = 1127 + mapData.position.x + x + 10 * (mapData.position.y + y);
            const random = new HMapRandom(seed);
            const fakeData: HMapRuinLocalDataJSON = {
                _dirs: mapData.getFakeDirs({x: mapData.position.x + x, y: mapData.position.y + y}),
                _move: true,
                _d: {
                    _exit: exit,
                    _room: random.getOneOfLocalSeed<HMapRuinRoomJSON | null>([ {
                        _locked: random.getOneOfLocalSeed<boolean>([true, false]),
                        _doorKind: random.getOneOfLocalSeed<number>([1, 2, 3])
                    }]),
                    _seed: seed,
                    _k: random.getRandomIntegerLocalSeed(0, 3),
                    _w: true,
                    _z: random.getOneOfLocalSeed<number>([random.getRandomIntegerLocalSeed(1, 3), 0, 0, 0, 0]),
                },
                _o: this.oxygen * 3000,
                _r: false,
                _x:  mapData.position.x + x,
                _y:  mapData.position.y + y
            };

            ruinLayer.appendNextTile(x, y, fakeData._dirs);

            // variables to manage the start effect
            ruinLayer.easeMovement({ x: 300 * x, y: 300 * y }, () => {
                this.partialDataReceived({ JSON: fakeData });
                this.moving = false; // allow another move
            });
        }
    }

    /**
     * Function called when the user click on a door
     */
    enterRoom() {

        if (Environment.getInstance().devMode === false) {

            const url = 'explo/enterRoom?' + js.JsExplo.sh;

            let hx: any;

            // @ts-ignore
            const page: any = window.wrappedJSObject;
            if (page !== undefined && page.haxe) { // greasemonkey ...
                hx = page.haxe;
            } else if (haxe) { // tampermonkey
                hx = haxe;
            }

            const r = new hx.Http('/' + url);
            js.XmlHttp.onStart(r);
            js.XmlHttp.urlForBack = url;
            r.setHeader('X-Handler', 'js.XmlHttp');
            r.onData = (data: string) => {
                this.hmap.originalOnData!(data); // we are sure the function has been set

                if (data.indexOf('js.JsExplo.init') !== -1) {
                    const startVar = data.indexOf('js.JsExplo.init') + 18;
                    const stopVar = data.indexOf('\',', startVar);
                    const tempMapData = data.substring(startVar, stopVar);

                    this.partialDataReceived({ raw: tempMapData });
                }
            };

            r.onError = js.XmlHttp.onError;
            r.request(false);

        } else { // dev mode, fake the data
            const mapData = this.mapData as HMapRuinData;
            // fake the data
            const fakeData: HMapRuinLocalDataJSON = mapData.data._r;
            fakeData._r = true;

            this.partialDataReceived({ JSON: fakeData });
        }
    }

    /**
     * Function called when the user exit the room
     */
    exitRoom() {

        if (Environment.getInstance().devMode === false) {
            const url = 'explo/leaveRoom?' + js.JsExplo.sh;

            let hx: any;

            // @ts-ignore
            const page: any = window.wrappedJSObject;
            if (page !== undefined && page.haxe) { // greasemonkey ...
                hx = page.haxe;
            } else if (haxe) { // tampermonkey
                hx = haxe;
            }

            const r = new hx.Http('/' + url);
            js.XmlHttp.onStart(r);
            js.XmlHttp.urlForBack = url;
            r.setHeader('X-Handler', 'js.XmlHttp');
            r.onData = (data: string) => {
                this.hmap.originalOnData!(data); // we are sure the function has been set

                if (data.indexOf('js.JsExplo.init') !== -1) {
                    const startVar = data.indexOf('js.JsExplo.init') + 18;
                    const stopVar = data.indexOf('\',', startVar);
                    const tempMapData = data.substring(startVar, stopVar);

                    this.partialDataReceived({ raw: tempMapData });
                }
            };

            r.onError = js.XmlHttp.onError;
            r.request(false);
        } else { // dev mode, fake the data
            const mapData = this.mapData as HMapRuinData;
            // fake the data
            const fakeData: HMapRuinLocalDataJSON = mapData.data._r;
            fakeData._r = false;

            this.partialDataReceived({ JSON: fakeData });
        }
    }

    protected generateMapData(payload?: HMapDataPayload) {
        return new HMapRuinData(payload);
    }

    /**
     * Action to execute when new data arrive
     */
    protected onDataReceived(init: boolean): void {

        // @TODO : guess the ruin type
        this.type = (this.mapData as HMapRuinData).ruinType;

        if (init) {
            HMapImagesLoader.getInstance().loadRuinPics(this.type);
        }

        this.registerArrows();

        // when preloading the pictures is finished, starts drawing
        HMapImagesLoader.getInstance()
            .preloadPictures(this.layers.get('loading') as HMapSVGLoadingLayer<HMapRuinDataJSON, HMapRuinLocalDataJSON>, init, () => {
                const hmapMenu = document.querySelector('#hmap-menu') as HTMLElement;
                if (hmapMenu !== null) {
                    hmapMenu.style.display = 'flex';
                }
                const loadingLayer = this.layers.get('loading') as HMapSVGLoadingLayer<HMapRuinDataJSON, HMapRuinLocalDataJSON>;
                loadingLayer.hide();
                this.layers.get('ruin-background')!.draw();
                const FGLayer = this.layers.get('ruin-foreground') as HMapSVGRuinForegroundLayer;
                if (init) {
                    FGLayer.draw();
                    this.watchOxygen();
                } else {
                    FGLayer.updateArrows();
                }
            });
    }

    /**
     * Copy the mapData to clipboard
     */
    private onDebugButtonClick() {
        const el = document.createElement('textarea');
        el.value = this.mapData!.prettyData;
        console.log(this.mapData!.data);
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);

        Toast.show(HMapLang.get('toastdebug'));
    }

    private watchOxygen() {
        if (this.oxygenTimer) {
            window.clearInterval(this.oxygenTimer);
        }
        const mapData = this.mapData as HMapRuinData;
        this.oxygen = Math.floor(mapData.oxygen / 3000);
        const FGLayer = this.layers.get('ruin-foreground') as HMapSVGRuinForegroundLayer;
        FGLayer.updateOxygen();
        this.oxygenTimer = window.setInterval(() => {
            if (this.oxygen <= 0) {
                window.clearInterval(this.oxygenTimer);
                this.oxygenTimer = undefined;
                return;
            }
            this.oxygen -= 1;
            FGLayer.updateOxygen();
        }, 3000);
    }

    /**
     * Register the available directionnal arrows
     */
    private registerArrows() {
        this.registredArrows = new Array<HMapArrow>();
        if (this.mapData) {
            const mapData = this.mapData as HMapRuinData;
            let offsetY, offsetX;
            if (mapData.room) {
                offsetY = 250;
                offsetX = - 41 + 150;
                const A = new HMapArrow(offsetX, offsetY, offsetX, offsetY, 83, 28, 'bottom', 180, false);
                this.registredArrows.push(A);
            } else {
                if (mapData.oxygen > 0) { // if we can move
                    const directions = mapData.directions;
                    if (directions[1] === true) {
                        offsetY = 15;
                        offsetX = - 41 + 150;
                        const A = new HMapArrow(offsetX, offsetY, offsetX, offsetY, 83, 28, 'top', 0, false);
                        this.registredArrows.push(A);
                    }
                    if (directions[3] === true) {
                        offsetY = 250;
                        offsetX = - 41 + 150;
                        const A = new HMapArrow(offsetX, offsetY, offsetX, offsetY, 83, 28, 'bottom', 180, false);
                        this.registredArrows.push(A);
                    }
                    if (directions[0] === true) {
                        offsetX = 230;
                        offsetY = - 14 + 150;
                        const A = new HMapArrow(offsetX, offsetY, offsetX + 27, offsetY - 27, 28, 83, 'right', 90, false);
                        this.registredArrows.push(A);
                    }
                    if (directions[2] === true) {
                        offsetX = -10;
                        offsetY = - 14 + 150;
                        const A = new HMapArrow(offsetX, offsetY, offsetX + 27, offsetY - 27, 28, 83, 'left', 270, false);
                        this.registredArrows.push(A);
                    }
                }
            }
        }
    }
}
