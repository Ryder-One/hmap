import { HMapPoint } from '../hmap';
import { Toast } from '../toast';
import { HMapAbstractMap } from './abstract';
import { HMapSVGGridLayer } from '../layers/svg-grid';
import { Environment } from '../environment';
import { HMapLang } from '../lang';
import { HMapSVGLoadingLayer } from '../layers/svg-loading';
import { HMapSVGGlassStaticLayer } from '../layers/svg-glass-static';
import { HMapDesertLocalDataJSON, HMapDesertDataJSON, HMapDesertData } from '../data/hmap-desert-data';
import { HMapDataPayload } from '../data/abstract';
import { HMapImagesLoader } from '../imagesLoader';

export type HMapGridMode = 'global' | 'personal';

export class HMapGridMap extends HMapAbstractMap<HMapDesertDataJSON, HMapDesertLocalDataJSON> {

    public mouse?: HMapPoint;
    public mouseOverIndex = -1;
    public mode: HMapGridMode = 'personal';
    public displayTags = false;

    get target(): HMapPoint {
        if (this.hmap.target) {
            return this.hmap.target;
        } else if (this.mapData) {
            return (this.mapData as HMapDesertData).town;
        } else {
            throw new Error('target and map data are not set');
        }
    }

    /**
     * Build the layers (SVG) for this map
     */
    public buildLayers(): void {

        const swf = document.querySelector(this.hmap.cssSelector);

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

                // create the buttons
                if (this.hmap.location === 'desert') { // we can switch the grid only in desert
                    const closeButton = document.createElement('div');
                    closeButton.setAttribute('id', 'hmap-close-button');
                    closeButton.setAttribute('class', 'hmap-button');
                    closeButton.innerHTML = HMapLang.get('closebutton');
                    hmapMenu.appendChild(closeButton);

                    closeButton.onclick = this.onMapButtonClick.bind(this);
                }

                const displayTagsButton = document.createElement('div');
                displayTagsButton.setAttribute('id', 'hmap-tags-button');
                displayTagsButton.setAttribute('class', 'hmap-button');
                hmapMenu.appendChild(displayTagsButton);

                if (!this.displayTags) {
                    const uncheckIcon = document.createElement('img');
                    uncheckIcon.setAttribute('src', Environment.getInstance().url + '/assets/uncheck.png');
                    uncheckIcon.style.marginRight = '3px';
                    displayTagsButton.appendChild(uncheckIcon);
                    displayTagsButton.append(HMapLang.get('markersbutton'));
                } else {
                    const checkIcon = document.createElement('img');
                    checkIcon.setAttribute('src', Environment.getInstance().url + '/assets/check.png');
                    checkIcon.style.marginRight = '3px';
                    displayTagsButton.appendChild(checkIcon);
                    displayTagsButton.append(HMapLang.get('markersbutton'));
                    displayTagsButton.style.background = '#696486'; // blue night
                }
                displayTagsButton.onclick = this.toggleDisplayTags.bind(this);

                const modeButton = document.createElement('div');
                modeButton.setAttribute('id', 'hmap-mode-button');
                modeButton.setAttribute('class', 'hmap-button');
                hmapMenu.appendChild(modeButton);

                if (this.mode !== 'global') {
                    const uncheckIcon = document.createElement('img');
                    uncheckIcon.setAttribute('src', Environment.getInstance().url + '/assets/uncheck.png');
                    uncheckIcon.style.marginRight = '3px';
                    modeButton.appendChild(uncheckIcon);
                    modeButton.append(HMapLang.get('modebutton'));
                } else {
                    const checkIcon = document.createElement('img');
                    checkIcon.setAttribute('src', Environment.getInstance().url + '/assets/check.png');
                    checkIcon.style.marginRight = '3px';
                    modeButton.appendChild(checkIcon);
                    modeButton.append(HMapLang.get('modebutton'));
                    modeButton.style.background = '#696486'; // blue night
                }

                modeButton.onclick = this.switchMode.bind(this);

                const resetViewButton = document.createElement('div');
                resetViewButton.setAttribute('id', 'hmap-reset-button');
                resetViewButton.setAttribute('class', 'hmap-button');
                resetViewButton.innerHTML = HMapLang.get('resetbutton');
                hmapMenu.appendChild(resetViewButton);
                resetViewButton.onclick = this.onResetButtonClick.bind(this);

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

            const GridLayer = new HMapSVGGridLayer(this);
            this.layers.set('grid', GridLayer);

            const GlassStatic = new HMapSVGGlassStaticLayer(this);
            this.layers.set('glass-static', GlassStatic);

            const LoadingLayer = new HMapSVGLoadingLayer(this);
            this.layers.set('loading', LoadingLayer);

        }
    }



    /**
     * Set the target of the grid
     */
    setTarget(index: HMapPoint) {
        // set the target for the pointing arrow
        if (this.hmap.location === 'desert' || this.hmap.location === 'doors') {
            this.hmap.target = index;
        }
    }

    protected generateMapData(payload?: HMapDataPayload) {
        return new HMapDesertData(payload);
    }

    /**
     * Action to execute when new data arrive
     */
    protected onDataReceived(init: boolean): void {

        // when preloading the pictures is finished, starts drawing
        HMapImagesLoader.getInstance()
            .preloadPictures(this.layers.get('loading') as HMapSVGLoadingLayer<HMapDesertDataJSON, HMapDesertLocalDataJSON>, init, () => {
                const hmapMenu = document.querySelector('#hmap-menu') as HTMLElement;
                if (hmapMenu !== null) {
                    hmapMenu.style.display = 'flex';
                }
                const loadingLayer = this.layers.get('loading') as HMapSVGLoadingLayer<HMapDesertDataJSON, HMapDesertLocalDataJSON>;
                loadingLayer.hide();
                this.layers.get('grid')!.draw();
                this.layers.get('glass-static')!.draw();
            });
    }

    /**
     * Close the grid and show the desert
     */
    private onMapButtonClick() {
        this.hmap.switchMapAndReload('desert');
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

    private onResetButtonClick() {
        const layer = this.layers.get('grid')! as HMapSVGGridLayer;
        layer.resetView();
    }

    private toggleDisplayTags() {
        const hmapTagButton = document.querySelector('#hmap-tags-button') as HTMLElement;
        while (hmapTagButton.lastChild) {
            hmapTagButton.removeChild(hmapTagButton.lastChild);
        }

        if (this.displayTags) {
            this.displayTags = false;
            const uncheckIcon = document.createElement('img');
            uncheckIcon.setAttribute('src', Environment.getInstance().url + '/assets/uncheck.png');
            uncheckIcon.style.marginRight = '3px';
            hmapTagButton.appendChild(uncheckIcon);
            hmapTagButton.append(HMapLang.get('markersbutton'));
            hmapTagButton.style.background = '#a13119'; // orange
        } else {
            this.displayTags = true;
            const checkIcon = document.createElement('img');
            checkIcon.setAttribute('src', Environment.getInstance().url + '/assets/check.png');
            checkIcon.style.marginRight = '3px';
            hmapTagButton.appendChild(checkIcon);
            hmapTagButton.append(HMapLang.get('markersbutton'));
            hmapTagButton.style.background = '#696486'; // blue night
        }
        const layer = this.layers.get('grid')! as HMapSVGGridLayer;
        layer.draw();
    }

    /**
     * Switch from global mode to personnal mode
     * Called on click on mode button
     */
    private switchMode() {
        const hmapModeButton = document.querySelector('#hmap-mode-button') as HTMLElement;

        if (this.mode === 'global') {
            this.mode = 'personal';
            if (hmapModeButton !== null) {
                while (hmapModeButton.lastChild) {
                    hmapModeButton.removeChild(hmapModeButton.lastChild);
                }
                const uncheckIcon = document.createElement('img');
                uncheckIcon.setAttribute('src', Environment.getInstance().url + '/assets/uncheck.png');
                uncheckIcon.style.marginRight = '3px';
                hmapModeButton.appendChild(uncheckIcon);
                hmapModeButton.append(HMapLang.get('modebutton'));
                hmapModeButton.style.background = '#a13119'; // orange
            }
        } else {
            this.mode = 'global';
            if (hmapModeButton !== null) {
                while (hmapModeButton.lastChild) {
                    hmapModeButton.removeChild(hmapModeButton.lastChild);
                }
                const checkIcon = document.createElement('img');
                checkIcon.setAttribute('src', Environment.getInstance().url + '/assets/check.png');
                checkIcon.style.marginRight = '3px';
                hmapModeButton.appendChild(checkIcon);
                hmapModeButton.append(HMapLang.get('modebutton'));
                hmapModeButton.style.background = '#696486'; // blue night
            }
        }

        if (this.layers.get('grid')) {
            this.layers.get('grid')!.draw();
        }
    }
}
