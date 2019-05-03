import { HMapData, HMapDataPayload } from '../hmap-data';
import { HMapImagesLoader } from '../imagesLoader';
import { HMap, HMapPoint } from '../hmap';
import { HMapGridMap } from './grid';
import { HMapLayerSVGType } from '../layers/abstract';
import { HMapSVGGridLayer } from '../layers/svg-grid';
import { HMapDesertMap } from './desert';
import { HMapSVGLoadingLayer } from '../layers/svg-loading';
import { HMapSVGDesertBackgroundLayer } from '../layers/svg-desert-background';
import { HMapSVGDesertForegroundLayer } from '../layers/svg-desert-foreground';
import { HMapSVGGlassStaticLayer } from '../layers/svg-glass-static';

export type HMapTypeMapStr = 'grid' | 'desert';
export type HMapTypeSVGMap = HMapGridMap | HMapDesertMap;

/**
 * The maps will be the components that will host all the HTML and the logic of the map itself
 * They are split into layers, and each layer is a SVG with its own behavior
 */
export abstract class HMapAbstractMap {
    protected hmap: HMap;

    protected layers = new Map<HMapLayerSVGType, HMapSVGGridLayer | HMapSVGLoadingLayer
        | HMapSVGDesertForegroundLayer | HMapSVGDesertBackgroundLayer | HMapSVGGlassStaticLayer>();

    protected animationLoopId?: number; // hold the request animation frame id

    public imagesLoader = HMapImagesLoader.getInstance();
    public mapData?: HMapData;

    get target(): HMapPoint {
        if (this.hmap.target) {
            return this.hmap.target;
        } else if (this.mapData) {
            return this.mapData.town;
        } else {
            throw new Error('target and map data are not set');
        }
    }

    get height(): number {
        return this.hmap.height;
    }

    get width(): number {
        return this.hmap.width;
    }

    constructor(hmap: HMap) {
        this.hmap = hmap;
    }

    /**
     * Called when the map data has been set or totally modified
     * This is the intialization function
     */
    completeDataReceived(mapDataPayload: HMapDataPayload) {
        this.mapData = new HMapData(mapDataPayload);
        const loading = new Image();
        loading.src = this.imagesLoader.get('loading').src;
        loading.onload = () => {
            const loadingLayer = this.layers.get('loading');
            if (loadingLayer) { // if there is a layer (can happen in debug mode)
                loadingLayer.draw();
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

        // the position has changed, the arrows may be different
        this.onDataReceived(false); // custom implementation, map by map
    }

    /**
     * Build the layers (HTML canvas) for this map
     */
    public abstract buildLayers(): void;

    /**
     * Action to execute when new data arrive
     * @param init true when the data are coming from the initialization phase
     */
    protected abstract onDataReceived(init: boolean): void;
}
