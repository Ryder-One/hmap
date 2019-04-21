import { HMapAbstractMap } from './abstract';
import { HMapGridLayer } from '../layers/grid';
import { HMapPoint } from '../hmap';
import { Toast } from '../toast';

export type HMapGridMode = 'global' | 'personal';

export class HMapGridMap extends HMapAbstractMap {

    public mouse?: HMapPoint;
    public mouseOverIndex = -1;
    public mode: HMapGridMode = 'personal';
    public enableClose = true;


    /**
     * Build the layers (HTML canvas) for this map
     */
    public buildLayers(): void {

        const swf = document.querySelector('.swf');

        if (swf !== null) {
            swf.setAttribute('style', 'display:flex;flex-direction:column;height:auto');

            if (document.querySelector('#hmap') === null) {
                const hmap = document.createElement('div');
                hmap.setAttribute('id', 'hmap');
                hmap.setAttribute('style', 'height:' + this.height + 'px;position:relative');
                swf.appendChild(hmap);

                // create the menu
                const hmapMenu = document.createElement('div');
                hmapMenu.setAttribute('id', 'hmap-menu');
                hmapMenu.setAttribute('style', 'position:absolute;bottom:0px;z-index:10;height:20px;display:none');
                hmap.appendChild(hmapMenu);

                // create the buttons
                if (this.enableClose) {
                    const closeButton = document.createElement('div');
                    closeButton.setAttribute('id', 'hmap-close-button');
                    closeButton.setAttribute('class', 'hmap-button');
                    closeButton.innerHTML = 'Close';
                    hmapMenu.appendChild(closeButton);

                    closeButton.onclick = this.onMapButtonClick.bind(this);
                }
                const modeButton = document.createElement('div');
                modeButton.setAttribute('id', 'hmap-mode-button');
                modeButton.setAttribute('class', 'hmap-button');
                hmapMenu.appendChild(modeButton);

                if (this.mode === 'global') {
                    modeButton.innerHTML = 'Personal';
                } else {
                    modeButton.innerHTML = 'Global';
                }

                modeButton.onclick = this.switchMode.bind(this);

                const debugButton = document.createElement('div');
                debugButton.setAttribute('id', 'hmap-debug-button');
                debugButton.setAttribute('class', 'hmap-button');
                debugButton.innerHTML = '< >';
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
            }

            const GridLayer = new HMapGridLayer(this);
            this.layers.set('grid', GridLayer);
            GridLayer.canvas.onmousemove = this.onMouseMove.bind(this);
            GridLayer.canvas.onmouseleave = this.onMouseLeave.bind(this);
            GridLayer.canvas.onclick = this.onMouseClick.bind(this);
        }
    }

    /**
     * Implementation of the animation loop
     */
    protected animationLoop(): void {
        this.layers.get('grid')!.draw();

        this.animationLoopId = undefined;
        this.startAnimation();
    }

    /**
     * Action to execute when new data arrive
     */
    protected onDataReceived(init: boolean): void {
        this.imagesLoader.registerBuildingsToPreload(this.mapData!.neighbours);

        let firstCtx = null; // loading bar when the phase is initialisation
        if (init === true) {
            firstCtx = this.layers.values().next().value.ctx; // take the ctx of the first layer
        }

        // when preloading the pictures is finished, starts drawing
        this.imagesLoader.preloadPictures(firstCtx, () => {
            const hmapMenu = document.querySelector('#hmap-menu') as HTMLElement;
            if (hmapMenu !== null) {
                hmapMenu.style.display = 'flex';
            }
            this.startAnimation();
        });
    }

    private onMouseMove(e: MouseEvent) {
        if (e.target) {
            const canvas = e.target as HTMLCanvasElement;
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            this.mouse = { x: mouseX, y: mouseY };
        }
    }

    private onMouseClick() {
        // set the target for the pointing arrow
        this.hmap.target = this.mapData!.getCoordinates(this.mouseOverIndex);
    }

    private onMouseLeave(e: MouseEvent) {
        this.mouse = { x: 0, y: 0 };
        this.mouseOverIndex = -1;
    }

    private onMapButtonClick() {
        this.hmap.switchMapAndReload('desert');
    }

    private onDebugButtonClick() {
        const el = document.createElement('textarea');
        el.value = this.mapData!.prettyData;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);

        Toast.show('Debug has been copied to clipboard');
    }

    private switchMode() {
        if (this.mode === 'global') {
            this.mode = 'personal';
            const hmapModeButton = document.querySelector('#hmap-mode-button') as HTMLElement;
            if (hmapModeButton !== null) {
                hmapModeButton.innerHTML = 'Global';
            }
        } else {
            this.mode = 'global';
            const hmapModeButton = document.querySelector('#hmap-mode-button') as HTMLElement;
            if (hmapModeButton !== null) {
                hmapModeButton.innerHTML = 'Personal';
            }
        }
    }
}
