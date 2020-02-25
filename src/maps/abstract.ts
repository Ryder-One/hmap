import { HMapImagesLoader } from '../imagesLoader';
import { HMap } from '../hmap';
import { HMapGridMap } from './grid';
import { HMapLayerSVGType } from '../layers/abstract';
import { HMapSVGGridLayer } from '../layers/svg-grid';
import { HMapDesertMap } from './desert';
import { HMapSVGLoadingLayer } from '../layers/svg-loading';
import { HMapSVGDesertBackgroundLayer } from '../layers/svg-desert-background';
import { HMapSVGDesertForegroundLayer } from '../layers/svg-desert-foreground';
import { HMapSVGGlassStaticLayer } from '../layers/svg-glass-static';
import { HMapRuin } from './ruin';
import { HMapData, HMapDataPayload } from '../data/abstract';
import { HMapSVGRuinBackgroundLayer } from '../layers/svg-ruin-background';
import { HMapSVGRuinForegroundLayer } from '../layers/svg-ruin-foreground';

export type HMapTypeMapStr = 'grid' | 'desert' | 'ruin';
export type HMapTypeSVGMap = HMapGridMap | HMapDesertMap | HMapRuin;

/**
 * The maps will be the components that will host all the HTML and the logic of the map itself
 * They are split into layers, and each layer is a SVG with its own behavior
 */
export abstract class HMapAbstractMap<DataJSON, LocalDataJSON> {

    public mapData?: HMapData<DataJSON, LocalDataJSON>; // @TODO clean the any

    protected hmap: HMap;

    protected layers = new Map<HMapLayerSVGType, HMapSVGGridLayer | HMapSVGLoadingLayer<DataJSON, LocalDataJSON>
    | HMapSVGDesertForegroundLayer | HMapSVGDesertBackgroundLayer | HMapSVGGlassStaticLayer | HMapSVGRuinBackgroundLayer |
    HMapSVGRuinForegroundLayer>();

    protected animationLoopId?: number; // hold the request animation frame id

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
        this.mapData = this.generateMapData(mapDataPayload);
        const loading = new Image();
        loading.src = HMapImagesLoader.getInstance().get('loading').src;
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

    protected abstract generateMapData(mapDataPayload?: HMapDataPayload): HMapData<DataJSON, LocalDataJSON>;
}
