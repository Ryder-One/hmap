import { HMapArrow, HMapArrowDirection } from '../arrow';
import { HMapNeighbour } from '../neighbours';
import { Toast } from '../toast';
import { Environment } from '../environment';
import { HMapLang } from '../lang';
import { HMapAbstractMap } from './abstract';
import { HMapSVGDesertBackgroundLayer } from '../layers/svg-desert-background';
import { HMapSVGLoadingLayer } from '../layers/svg-loading';
import { HMapSVGDesertForegroundLayer } from '../layers/svg-desert-foreground';

declare var haxe: any;
declare var js: any;


export class HMapDesertMap extends HMapAbstractMap {

    public registredArrows = new Array<HMapArrow>();

    private moving = false; // dirty boolean to avoid double move

    /**
     * Append the HTML
     */
    public buildLayers(): void {
        // inject some HTML to make room for the map

        const swf = document.querySelector('.swf');
        if (swf !== null) {
            swf.setAttribute('style', 'display:flex;flex-direction:column;height:auto');

            if (this.hmap.displayFlashMap === false) {
                const originalMap = document.querySelector('#swfCont') as HTMLElement;
                if (originalMap) {
                    originalMap.style.display = 'none';
                }
            }

            if (document.querySelector('#hmap') === null) {
                const hmap = document.createElement('div');
                hmap.setAttribute('id', 'hmap');
                hmap.setAttribute('style', 'width:' + this.width + 'px;height:' + this.height + 'px;position:relative');
                swf.appendChild(hmap);

                // create the menu
                const hmapMenu = document.createElement('div');
                hmapMenu.setAttribute('id', 'hmap-menu');
                hmapMenu.setAttribute('style', 'position:absolute;bottom:0px;z-index:10;height:20px;display:none');
                hmap.appendChild(hmapMenu);

                const mapButton = document.createElement('div');
                mapButton.setAttribute('id', 'hmap-minimap-button');
                mapButton.setAttribute('class', 'hmap-button');
                hmapMenu.appendChild(mapButton);
                mapButton.onclick = this.onMapButtonClick.bind(this);

                const mapIcon = document.createElement('img');
                mapIcon.setAttribute('id', 'hmap-minimap-icon');
                mapIcon.setAttribute('src', Environment.getInstance().url + '/assets/minimap.png');
                mapButton.appendChild(mapIcon);
                mapButton.append(HMapLang.get('mapbutton'));
                mapButton.style.marginRight = '3px';

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

                hmap.onmousemove = this.onMouseMove.bind(this);
                hmap.onmouseleave = this.onMouseLeave.bind(this);
            }
        }

        const backgroundLayer = new HMapSVGDesertBackgroundLayer(this);
        this.layers.set('desert-background', backgroundLayer);

        const foregroundLayer = new HMapSVGDesertForegroundLayer(this);
        this.layers.set('desert-foreground', foregroundLayer);

        const LoadingLayer = new HMapSVGLoadingLayer(this);
        this.layers.set('loading', LoadingLayer);
    }

    private onMouseMove(e: MouseEvent) {
        const layerBackground = this.layers.get('desert-background') as HMapSVGDesertBackgroundLayer;
        layerBackground.onMouseMove(e);
    }

    private onMouseLeave(e: MouseEvent) {
        const layerBackground = this.layers.get('desert-background') as HMapSVGDesertBackgroundLayer;
        layerBackground.onMouseLeave(e);
    }

    /**
     * When new data arrive, rebuild the arrows
     */
    protected onDataReceived(init: boolean): void {
        this.registerArrows();

        this.imagesLoader.registerBuildingsToPreload(this.mapData!.neighbours);

        // when preloading the pictures is finished, starts drawing
        this.imagesLoader.preloadPictures(this.layers.get('loading') as HMapSVGLoadingLayer, init, () => {
            const hmapMenu = document.querySelector('#hmap-menu') as HTMLElement;
            if (hmapMenu !== null) {
                hmapMenu.style.display = 'flex';
            }
            const loadingLayer = this.layers.get('loading') as HMapSVGLoadingLayer;
            loadingLayer.hide();
            this.layers.get('desert-background')!.draw();
            this.layers.get('desert-foreground')!.draw();
        });
    }

    /**
     * Function called when the user click on a directionnal arrow
     * The function is big due to the debug mode
     */
    move(direction: HMapArrowDirection) {

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

        const bgLayer = this.layers.get('desert-background') as HMapSVGDesertBackgroundLayer;

        if (Environment.getInstance().devMode === false) {
            const url = 'outside/go?x=' + x + ';y=' + y + ';z=' + this.mapData!.zoneId + js.JsMap.sh;

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

                bgLayer.easeMovement({ x: 100 * x, y: 100 * y }, () => {
                    // move the position
                    this.mapData!.movePosition(x, y);

                    if (data.indexOf('js.JsMap.init') !== -1) {
                        const startVar = data.indexOf('js.JsMap.init') + 16;
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

            // variables to manage the start effect
            bgLayer.easeMovement({ x: 100 * x, y: 100 * y }, () => {
                // move the position
                this.mapData!.movePosition(x, y);

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
                if (newIndex + 1 < (this.mapData!.size.width * this.mapData!.size.height)) {
                    fakeData._neig.push(this.mapData!.data._details[newIndex + 1]._z);
                } else {
                    fakeData._neig.push(0);
                }
                if (newIndex + this.mapData!.size.height < (this.mapData!.size.height * this.mapData!.size.height)) {
                    fakeData._neig.push(this.mapData!.data._details[newIndex + this.mapData!.size.height]._z);
                } else {
                    fakeData._neig.push(0);
                }
                if (newIndex - 1 > 0) {
                    fakeData._neig.push(this.mapData!.data._details[newIndex - 1]._z);
                } else {
                    fakeData._neig.push(0);
                }

                this.partialDataReceived({ JSON: fakeData });
                this.moving = false; // allow another move
            });
        }
    }

    /**
     * The click on the map button will switch the map from desert to grid
     */
    private onMapButtonClick() {
        this.hmap.switchMapAndReload('grid');
    }

    /**
     * The click on the debug button will copy the data to the clipboard
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
                            const A = new HMapArrow(offsetX, offsetY, offsetX, offsetY, 83, 28, 'top', 0, false);
                            this.registredArrows.push(A);
                        } else if (neighbour.position === 'bottom_center') {
                            offsetY = 250;
                            offsetX = - 41 + 150;
                            const A = new HMapArrow(offsetX, offsetY, offsetX, offsetY, 83, 28, 'bottom', 180, false);
                            this.registredArrows.push(A);
                        } else if (neighbour.position === 'middle_right') {
                            offsetX = 230;
                            offsetY = - 14 + 150;
                            const A = new HMapArrow(offsetX, offsetY, offsetX + 27, offsetY - 27, 28, 83, 'right', 90, false);
                            this.registredArrows.push(A);
                        } else if (neighbour.position === 'middle_left') {
                            offsetX = -10;
                            offsetY = - 14 + 150;
                            const A = new HMapArrow(offsetX, offsetY, offsetX + 27, offsetY - 27, 28, 83, 'left', 270, false);
                            this.registredArrows.push(A);
                        }
                    }
                });
            }
        }
    }
}
