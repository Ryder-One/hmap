import { HMapData, HMapDataPayload } from '../hmap-data';
import { HMapLayerType } from '../layers/abstract';
import { HMapBackgroundLayer } from '../layers/background';
import { HMapForegroundLayer } from '../layers/foreground';
import { HMapBufferLayer } from '../layers/buffer';
import { HMapImagesLoader } from '../imagesLoader';
import { HMapGridLayer } from '../layers/grid';
import { HMapDesertMap } from './desert';
import { HMapGridMap } from './grid';

export type HMapTypeMap = HMapGridMap | HMapDesertMap;

export abstract class HMapAbstractMap {
    protected jQ: JQueryStatic;
    protected devMode = false;

    protected layers = new Map<HMapLayerType, HMapBackgroundLayer|HMapForegroundLayer|HMapBufferLayer|HMapGridLayer>();

    protected animationLoopId?: number; // hold the request animation frame id

    public imagesLoader = new HMapImagesLoader();
    public mapData?: HMapData;

    constructor(jQ: JQueryStatic, devMode?: boolean) {

        this.jQ = jQ;
        if (devMode !== undefined) {
            this.devMode = devMode;
        }
    }

    /**
     * Called when the map data has been set or totally modified
     * This is the intialization function
     */
    completeDataReceived(data?: string) {
        if (data === null || data === undefined) {
            this.mapData = new HMapData(null, HMapData.fakeData());
        } else {
            this.mapData = new HMapData(data);
        }

        const loading = new Image();
        loading.src = this.imagesLoader.get('loading').src;
        loading.onload = () => {
            if (this.layers.values().next().value) { // if there is a layer (can happen in debug mode)
                const firstCtx = this.layers.values().next().value.ctx; // take the ctx of the first layer do draw the loading bar
                if (firstCtx) {
                    firstCtx.drawImage(loading, 0, 0);
                }
            }

            this.onDataReceived(true); // custom implementation, map by map
        };
    }

    /**
     * Called when a small part of the mapData has been updated
     */
    partialDataReceived(tempMapData: HMapDataPayload) {

        // patch the store with new data
        this.mapData!.patchData(tempMapData);

        // stop the animation to preload the pictures
        this.stopAnimation();

        // the position has changed, the arrows may be different
        this.onDataReceived(false); // custom implementation, map by map
    }

    /**
     * Build the layers (HTML canvas) for this map
     */
    public abstract buildLayers(): void;

    /**
     * Implementation of the animation loop
     */
    protected abstract animationLoop(): void;

    /**
     * Action to execute when new data arrive
     * @param init true when the data are coming from the initialization phase
     */
    protected abstract onDataReceived(init: boolean): void;

    /**
     * Utility function to have a nice start/stop animation
     */
    protected startAnimation() {
        if (!this.animationLoopId) {
            this.animationLoopId = window.requestAnimationFrame(this.animationLoop.bind(this));
        }
    }

    protected stopAnimation() {
        if (this.animationLoopId) {
           window.cancelAnimationFrame(this.animationLoopId);
           this.animationLoopId = undefined;
        }
    }
}
