import { HMapNeighbour, HMapNeighbours } from './neighbours';
import { Environment } from './environment';
import { Toast } from './toast';
import { HMapSVGLoadingLayer } from './layers/svg-loading';
import { HMapRuinType } from './maps/ruin';

export interface HMapImage {
    src: string;
    obj?: HTMLImageElement;
}

/**
 * This class is a helper to help preload the images
 */
export class HMapImagesLoader {

    static _instance: HMapImagesLoader;

    private images = new Map<string, HMapImage>();

    static getInstance(): HMapImagesLoader {
        if (this._instance === undefined) {
            this._instance = new HMapImagesLoader();
        }
        return this._instance;
    }

    constructor() {

        // images to preload
        this.images.set('loading', { src: Environment.getInstance().url + '/assets/loading.png', obj: undefined });
        this.images.set('glass', { src: Environment.getInstance().url + '/assets/glass.png', obj: undefined });
        this.images.set('humanGlow', { src: Environment.getInstance().url + '/assets/human_glow.png', obj: undefined });
        this.images.set('map', { src: Environment.getInstance().url + '/assets/map.png', obj: undefined });
        this.images.set('moveArrowFill', { src: Environment.getInstance().url + '/assets/move_arrow_fill.png', obj: undefined });
        this.images.set('moveArrowLight', { src: Environment.getInstance().url + '/assets/move_arrow_light.png', obj: undefined });
        this.images.set('moveArrowOutline', { src: Environment.getInstance().url + '/assets/move_arrow_outline.png', obj: undefined });
        this.images.set('night', { src: Environment.getInstance().url + '/assets/night.png', obj: undefined });
        this.images.set('shadowFocus', { src: Environment.getInstance().url + '/assets/shadow_focus.png', obj: undefined });
        this.images.set('targetArrow', { src: Environment.getInstance().url + '/assets/town_arrow.png', obj: undefined });
        this.images.set('zombieGlow', { src: Environment.getInstance().url + '/assets/zombie_glow.png', obj: undefined });
        this.images.set('blood', { src: Environment.getInstance().url + '/assets/blood.png', obj: undefined });
        this.images.set('single', { src: Environment.getInstance().url + '/assets/single.png', obj: undefined });
        this.images.set('hatch', { src: Environment.getInstance().url + '/assets/hatch.png', obj: undefined });
        this.images.set('town', { src: Environment.getInstance().url + '/assets/town.png', obj: undefined });
        this.images.set('building', { src: Environment.getInstance().url + '/assets/building.png', obj: undefined });
        this.images.set('hatch-dense', { src: Environment.getInstance().url + '/assets/hatch_dense.png', obj: undefined });
        this.images.set('target', { src: Environment.getInstance().url + '/assets/target.png', obj: undefined });
        this.images.set('position', { src: Environment.getInstance().url + '/assets/position.png', obj: undefined });
        this.images.set('people', { src: Environment.getInstance().url + '/assets/people.png', obj: undefined });
        this.images.set('uncheck', { src: Environment.getInstance().url + '/assets/uncheck.png', obj: undefined });
        this.images.set('check', { src: Environment.getInstance().url + '/assets/check.png', obj: undefined });
        this.images.set('destination', { src: Environment.getInstance().url + '/assets/destination.png', obj: undefined });

        for (let tag = 1; tag <= 11; tag++) {
            this.images.set('tag_' + tag, { src: Environment.getInstance().url + '/assets/tags/' + tag + '.png', obj: undefined });
        }
        // tag 12 is a gif
        this.images.set('tag_12', { src: Environment.getInstance().url + '/assets/tags/12.gif', obj: undefined });
    }

    public loadRuinPics(location: HMapRuinType) {
        this.images.set('0001', { src: Environment.getInstance().url + '/assets/ruin/' + location + '/0001.png', obj: undefined });
        this.images.set('0010', { src: Environment.getInstance().url + '/assets/ruin/' + location + '/0010.png', obj: undefined });
        this.images.set('0011', { src: Environment.getInstance().url + '/assets/ruin/' + location + '/0011.png', obj: undefined });
        this.images.set('0100', { src: Environment.getInstance().url + '/assets/ruin/' + location + '/0100.png', obj: undefined });
        this.images.set('0101', { src: Environment.getInstance().url + '/assets/ruin/' + location + '/0101.png', obj: undefined });
        this.images.set('0110', { src: Environment.getInstance().url + '/assets/ruin/' + location + '/0110.png', obj: undefined });
        this.images.set('0111', { src: Environment.getInstance().url + '/assets/ruin/' + location + '/0111.png', obj: undefined });
        this.images.set('1000', { src: Environment.getInstance().url + '/assets/ruin/' + location + '/1000.png', obj: undefined });
        this.images.set('1001', { src: Environment.getInstance().url + '/assets/ruin/' + location + '/1001.png', obj: undefined });
        this.images.set('1010', { src: Environment.getInstance().url + '/assets/ruin/' + location + '/1010.png', obj: undefined });
        this.images.set('1011', { src: Environment.getInstance().url + '/assets/ruin/' + location + '/1011.png', obj: undefined });
        this.images.set('1100', { src: Environment.getInstance().url + '/assets/ruin/' + location + '/1100.png', obj: undefined });
        this.images.set('1101', { src: Environment.getInstance().url + '/assets/ruin/' + location + '/1101.png', obj: undefined });
        this.images.set('1110', { src: Environment.getInstance().url + '/assets/ruin/' + location + '/1110.png', obj: undefined });
        this.images.set('1111', { src: Environment.getInstance().url + '/assets/ruin/' + location + '/1111.png', obj: undefined });
        this.images.set('dead', { src: Environment.getInstance().url + '/assets/ruin/' + location + '/dead.png', obj: undefined });
        this.images.set('elem1', { src: Environment.getInstance().url + '/assets/ruin/' + location + '/elem1.png', obj: undefined });
        this.images.set('elem2', { src: Environment.getInstance().url + '/assets/ruin/' + location + '/elem2.png', obj: undefined });
        this.images.set('elem3', { src: Environment.getInstance().url + '/assets/ruin/' + location + '/elem3.png', obj: undefined });
        this.images.set('elem4', { src: Environment.getInstance().url + '/assets/ruin/' + location + '/elem4.png', obj: undefined });
        this.images.set('elem5', { src: Environment.getInstance().url + '/assets/ruin/' + location + '/elem5.png', obj: undefined });
        this.images.set('light', { src: Environment.getInstance().url + '/assets/ruin/' + location + '/light.png', obj: undefined });
        this.images.set('exit', { src: Environment.getInstance().url + '/assets/ruin/' + location + '/exit.png', obj: undefined });
        this.images.set('room', { src: Environment.getInstance().url + '/assets/ruin/' + location + '/room.png', obj: undefined });
        this.images.set('zombiegif', { src: Environment.getInstance().url + '/assets/ruin/' + location + '/zombie.gif', obj: undefined });
        this.images.set('you', { src: Environment.getInstance().url + '/assets/ruin/you.gif', obj: undefined });
        this.images.set('you-noox', { src: Environment.getInstance().url + '/assets/ruin/you_noox.gif', obj: undefined });
        this.images.set('scanner', { src: Environment.getInstance().url + '/assets/ruin/scanner.gif', obj: undefined });
    }

    public isset(imageId: string): boolean {
        return (this.images.get(imageId) !== undefined);
    }

    public get(imageId: string): HMapImage {
        return this.images.get(imageId)!; // assuming we's always passing a known id. It'll avoid lots of !
    }

    public set(imageId: string, value: HMapImage) {
        this.images.set(imageId, value);
    }

    public issetImg(imageId: string): boolean {
        return (this.isset(imageId) && this.get(imageId).obj !== undefined);
    }

    public getImg(imageId: string): HTMLImageElement | undefined {
        return this.get(imageId).obj;
    }

    /**
      * Preload the pictures and complete the images meta object
      * It will also display the loading animation on the layer BG
      * @param loadingLayer layer with the progress bar
      * @param init boolean to tell if we are in initialisation phaseor not (display bar or not)
      * @param onFinished callback to be called when it's done
      */
     public preloadPictures (loadingLayer: HMapSVGLoadingLayer<Object, Object>, init: boolean, onFinished: CallableFunction) {
        let loaded = 0;

        this.images.forEach((value: HMapImage) => {
            if (value.obj === undefined) { // not already loaded, then load it
                const img = new Image();
                img.src = value.src;
                img.onload = () => {
                    if (init) {
                        loadingLayer.progress(loaded / this.images.size);
                    }

                    if (++loaded === this.images.size && onFinished) {
                        onFinished(); // when it's done, start the drawing
                    }
                };
                img.onerror = () => {
                    Toast.show('Cannot load ressource : ' + value.src);
                };
                value.obj = img;
            } else { // already loaded, skip it with the same code. That's ugly but I got myself trapped
                if (init) {
                    loadingLayer.progress(loaded / this.images.size);
                }
                if (++loaded === this.images.size && onFinished) {
                    onFinished(); // when it's done, start the drawing
                }
            }
        });
    }

    /**
     * Register the buildings to preload the pics (this is done to avoid the preloading of the 60+ pics of buildings)
     */
    public registerBuildingsToPreload(neighbours: HMapNeighbours) {
        // register the buildings to draw it later
        neighbours.neighbours.forEach((neighbour: HMapNeighbour) => {
            if (neighbour.building !== 0 && neighbour.building !== undefined && !this.issetImg('b' + neighbour.building)) {
                let url;
                if (neighbour.building === -1) {
                    url = Environment.getInstance().url + '/assets/buildings/b_m1.png';
                } else {
                    url = Environment.getInstance().url + '/assets/buildings/b_' + neighbour.building + '.png';
                }
                this.set('b' + neighbour.building, {
                    src: url,
                    obj: undefined
                });
            }
        });
    }

}
