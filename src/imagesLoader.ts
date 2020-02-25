import { HMapNeighbour, HMapNeighbours } from './neighbours';
import { Environment } from './environment';
import { Toast } from './toast';
import { HMapSVGLoadingLayer } from './layers/svg-loading';
import { HMapRuinType } from './maps/ruin';

export interface HMapImage {
    src: string;
    obj?: HTMLImageElement;
    width: number;
    height: number;
}

/**
 * This class is a helper to help preload the images
 */
export class HMapImagesLoader {

    static _instance: HMapImagesLoader;

    private images = new Map<string, HMapImage>();

    constructor() {

        // images to preload
        const url = Environment.getInstance().url + '/assets/';
        this.images.set('loading',          { src: url + 'loading.png',            obj: undefined, width: 300, height: 300});
        this.images.set('glass',            { src: url + 'glass.png',              obj: undefined, width: 300, height: 300});
        this.images.set('humanGlow',        { src: url + 'human_glow.png',         obj: undefined, width: 18,  height: 18});
        this.images.set('map',              { src: url + 'map.png',                obj: undefined, width: 950, height: 950});
        this.images.set('moveArrowFill',    { src: url + 'move_arrow_fill.png',    obj: undefined, width: 82,  height: 27});
        this.images.set('moveArrowLight',   { src: url + 'move_arrow_light.png',   obj: undefined, width: 82,  height: 27});
        this.images.set('moveArrowOutline', { src: url + 'move_arrow_outline.png', obj: undefined, width: 83,  height: 28});
        this.images.set('night',            { src: url + 'night.png',              obj: undefined, width: 950, height: 950});
        this.images.set('shadowFocus',      { src: url + 'shadow_focus.png',       obj: undefined, width: 433, height: 433});
        this.images.set('targetArrow',      { src: url + 'town_arrow.png',         obj: undefined, width: 9,   height: 17});
        this.images.set('zombieGlow',       { src: url + 'zombie_glow.png',        obj: undefined, width: 18,  height: 18});
        this.images.set('blood',            { src: url + 'blood.png',              obj: undefined, width: 300, height: 300});
        this.images.set('single',           { src: url + 'single.png',             obj: undefined, width: 200, height: 200});
        this.images.set('hatch',            { src: url + 'hatch.png',              obj: undefined, width: 26,  height: 26});
        this.images.set('town',             { src: url + 'town.png',               obj: undefined, width: 26,  height: 26});
        this.images.set('building',         { src: url + 'building.png',           obj: undefined, width: 25,  height: 25});
        this.images.set('hatch-dense',      { src: url + 'hatch_dense.png',        obj: undefined, width: 25,  height: 25});
        this.images.set('target',           { src: url + 'target.png',             obj: undefined, width: 25,  height: 25});
        this.images.set('position',         { src: url + 'position.png',           obj: undefined, width: 25,  height: 25});
        this.images.set('people',           { src: url + 'people.png',             obj: undefined, width: 5,   height: 5});
        this.images.set('uncheck',          { src: url + 'uncheck.png',            obj: undefined, width: 12,  height: 13});
        this.images.set('check',            { src: url + 'check.png',              obj: undefined, width: 12,  height: 13});
        this.images.set('destination',      { src: url + 'destination.png',        obj: undefined, width: 12,  height: 12});

        for (let tag = 1; tag <= 11; tag++) {
            this.images.set('tag_' + tag,   { src: url + 'tags/' + tag + '.png',   obj: undefined, width: 16,  height: 16});
        }
        // tag 12 is a gif
        this.images.set('tag_12',           { src: url + 'tags/12.gif',            obj: undefined, width: 16,  height: 16});
    }

    static getInstance(): HMapImagesLoader {
        if (this._instance === undefined) {
            this._instance = new HMapImagesLoader();
        }
        return this._instance;
    }

    public loadRuinPics(location: HMapRuinType) {
        const url = Environment.getInstance().url + '/assets/ruin/';
        this.images.set('0001',                     { src: url + location + '/0001.png',   obj: undefined, width: 300, height: 300});
        this.images.set('0010',                     { src: url + location + '/0010.png',   obj: undefined, width: 300, height: 300 });
        this.images.set('0011',                     { src: url + location + '/0011.png',   obj: undefined, width: 300, height: 300 });
        this.images.set('0100',                     { src: url + location + '/0100.png',   obj: undefined, width: 300, height: 300 });
        this.images.set('0101',                     { src: url + location + '/0101.png',   obj: undefined, width: 300, height: 300 });
        this.images.set('0110',                     { src: url + location + '/0110.png',   obj: undefined, width: 300, height: 300 });
        this.images.set('0111',                     { src: url + location + '/0111.png',   obj: undefined, width: 300, height: 300 });
        this.images.set('1000',                     { src: url + location + '/1000.png',   obj: undefined, width: 300, height: 300 });
        this.images.set('1001',                     { src: url + location + '/1001.png',   obj: undefined, width: 300, height: 300 });
        this.images.set('1010',                     { src: url + location + '/1010.png',   obj: undefined, width: 300, height: 300 });
        this.images.set('1011',                     { src: url + location + '/1011.png',   obj: undefined, width: 300, height: 300 });
        this.images.set('1100',                     { src: url + location + '/1100.png',   obj: undefined, width: 300, height: 300 });
        this.images.set('1101',                     { src: url + location + '/1101.png',   obj: undefined, width: 300, height: 300 });
        this.images.set('1110',                     { src: url + location + '/1110.png',   obj: undefined, width: 300, height: 300 });
        this.images.set('1111',                     { src: url + location + '/1111.png',   obj: undefined, width: 300, height: 300 });
        this.images.set('dead',                     { src: url + location + '/dead.png',   obj: undefined, width: 23,  height: 36  });
        // this.images.set('light',                    { src: url + location + '/light.png',  obj: undefined, width: , height:  });
        this.images.set('exit',                     { src: url + location + '/exit.png',   obj: undefined, width: 62 , height: 57  });
        this.images.set('room',                     { src: url + location + '/room.png',   obj: undefined, width: 300, height: 300 });
        this.images.set('zombiegif',                { src: url + location + '/zombie.gif', obj: undefined, width: 25 , height: 38  });
        this.images.set('door-top-closed',          { src: url + location + '/dtc.png',    obj: undefined, width: 30 , height: 30  });
        this.images.set('door-top-open',            { src: url + location + '/dto.png',    obj: undefined, width: 30 , height: 30  });
        this.images.set('door-top-right-closed',    { src: url + location + '/dtrc.png',   obj: undefined, width: 30 , height: 30  });
        this.images.set('door-top-right-open',      { src: url + location + '/dtro.png',   obj: undefined, width: 30 , height: 30  });
        this.images.set('door-top-left-closed',     { src: url + location + '/dtlc.png',   obj: undefined, width: 30 , height: 30  });
        this.images.set('door-top-left-open',       { src: url + location + '/dtlo.png',   obj: undefined, width: 30 , height: 30  });
        this.images.set('door-bottom-closed',       { src: url + location + '/dbc.png',    obj: undefined, width: 30 , height: 30  });
        this.images.set('door-bottom-open',         { src: url + location + '/dbo.png',    obj: undefined, width: 30 , height: 30  });
        this.images.set('door-bottom-right-closed', { src: url + location + '/dbrc.png',   obj: undefined, width: 30,  height: 30  });
        this.images.set('door-bottom-right-open',   { src: url + location + '/dbro.png',   obj: undefined, width: 30 , height: 30  });
        this.images.set('door-bottom-left-closed',  { src: url + location + '/dblc.png',   obj: undefined, width: 30 , height: 30  });
        this.images.set('door-bottom-left-open',    { src: url + location + '/dblo.png',   obj: undefined, width: 30 , height: 30  });
        this.images.set('door-left-closed',         { src: url + location + '/dlc.png',    obj: undefined, width: 30 , height: 30  });
        this.images.set('door-left-open',           { src: url + location + '/dlo.png',    obj: undefined, width: 30 , height: 30  });
        this.images.set('door-right-closed',        { src: url + location + '/drc.png',    obj: undefined, width: 30 , height: 30  });
        this.images.set('door-right-open',          { src: url + location + '/dro.png',    obj: undefined, width: 30 , height: 30  });
        this.images.set('you',                      { src: url + 'you.gif',                obj: undefined, width: 16 , height: 32  });
        this.images.set('you-noox',                 { src: url + 'you_noox.gif',           obj: undefined, width: 16 , height: 34  });
        this.images.set('scanner',                  { src: url + 'scanner.gif',            obj: undefined, width: 38 , height: 27  });

        if (location === 'motel') {
            this.images.set('wall_bench_A',         { src: url + location + '/wall_bench_A.png',      obj: undefined, width: 42, height: 22 });
            this.images.set('wall_bench_B',         { src: url + location + '/wall_bench_B.png',      obj: undefined, width: 42, height: 22 });
            this.images.set('wall_bench_G',         { src: url + location + '/wall_bench_G.png',      obj: undefined, width: 42, height: 22 });
            this.images.set('wall_bench_H',         { src: url + location + '/wall_bench_H.png',      obj: undefined, width: 42, height: 22 });
            this.images.set('wall_flowers_D',       { src: url + location + '/wall_flowers_D.png',    obj: undefined, width: 22, height: 39 });
            this.images.set('wall_flowers_E',       { src: url + location + '/wall_flowers_E.png',    obj: undefined, width: 22, height: 39 });
            this.images.set('wall_palmtree_B',      { src: url + location + '/wall_palmtree_B.png',   obj: undefined, width: 25, height: 35 });
            this.images.set('wall_palmtree_G',      { src: url + location + '/wall_palmtree_G.png',   obj: undefined, width: 25, height: 35 });
            this.images.set('zone_dead_bottom',     { src: url + location + '/zone_dead_bottom.png',  obj: undefined, width: 28, height: 53 });
            this.images.set('zone_dead_left',       { src: url + location + '/zone_dead_left.png',    obj: undefined, width: 53, height: 28 });
            this.images.set('zone_dead_right',      { src: url + location + '/zone_dead_right.png',   obj: undefined, width: 53, height: 28 });
            this.images.set('zone_dead_top',        { src: url + location + '/zone_dead_top.png',     obj: undefined, width: 28, height: 53 });
            this.images.set('zone_stain_bottom',    { src: url + location + '/zone_stain_bottom.png', obj: undefined, width: 70, height: 95 });
            this.images.set('zone_stain_left',      { src: url + location + '/zone_stain_left.png',   obj: undefined, width: 95, height: 70 });
            this.images.set('zone_stain_right',     { src: url + location + '/zone_stain_right.png',  obj: undefined, width: 95, height: 70 });
            this.images.set('zone_stain_top',       { src: url + location + '/zone_stain_top.png',    obj: undefined, width: 70, height: 95 });
        } else if (location === 'hospital') {
            this.images.set('wall_bed_D',           { src: url + location + '/wall_bed_D.png',        obj: undefined, width: 20, height: 51 });
            this.images.set('wall_bed_E',           { src: url + location + '/wall_bed_E.png',        obj: undefined, width: 20, height: 51 });
            this.images.set('wall_dead_D',          { src: url + location + '/wall_dead_D.png',       obj: undefined, width: 30, height: 32 });
            this.images.set('wall_dead_E',          { src: url + location + '/wall_dead_E.png',       obj: undefined, width: 30, height: 32 });
            this.images.set('wall_grid_J',          { src: url + location + '/wall_grid_J.png',       obj: undefined, width: 12, height: 25 });
            this.images.set('wall_grid_K',          { src: url + location + '/wall_grid_K.png',       obj: undefined, width: 12, height: 25 });
            this.images.set('zone_dead_bottom',     { src: url + location + '/zone_dead_bottom.png',  obj: undefined, width: 28, height: 27 });
            this.images.set('zone_dead_left',       { src: url + location + '/zone_dead_left.png',    obj: undefined, width: 27, height: 28 });
            this.images.set('zone_dead_right',      { src: url + location + '/zone_dead_right.png',   obj: undefined, width: 27, height: 28 });
            this.images.set('zone_dead_top',        { src: url + location + '/zone_dead_top.png',     obj: undefined, width: 28, height: 27 });
        } else if (location === 'bunker') {
            this.images.set('wall_barrel_D',        { src: url + location + '/wall_barrel_D.png',     obj: undefined, width: 18, height: 27 });
            this.images.set('wall_barrel_E',        { src: url + location + '/wall_barrel_E.png',     obj: undefined, width: 18, height: 27 });
            this.images.set('wall_grid_D',          { src: url + location + '/wall_grid_D.png',       obj: undefined, width: 12, height: 54 });
            this.images.set('wall_grid_E',          { src: url + location + '/wall_grid_E.png',       obj: undefined, width: 12, height: 54 });
            this.images.set('wall_gutter_B',        { src: url + location + '/wall_gutter_B.png',     obj: undefined, width: 32, height: 21 });
            this.images.set('wall_gutter_G',        { src: url + location + '/wall_gutter_G.png',     obj: undefined, width: 32, height: 21 });
            this.images.set('wall_hatch_A',         { src: url + location + '/wall_hatch_A.png',      obj: undefined, width: 25, height: 14 });
            this.images.set('wall_hatch_B',         { src: url + location + '/wall_hatch_B.png',      obj: undefined, width: 25, height: 14 });
            this.images.set('wall_hatch_G',         { src: url + location + '/wall_hatch_G.png',      obj: undefined, width: 25, height: 14 });
            this.images.set('wall_hatch_H',         { src: url + location + '/wall_hatch_H.png',      obj: undefined, width: 25, height: 14 });
            this.images.set('wall_pipe_D',          { src: url + location + '/wall_pipe_D.png',       obj: undefined, width: 42, height: 59 });
            this.images.set('wall_pipe_E',          { src: url + location + '/wall_pipe_E.png',       obj: undefined, width: 42, height: 59 });
        }
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
                this.set('b' + neighbour.building, { src: url, obj: undefined, height: 100, width: 100 });
            }
        });
    }

}
