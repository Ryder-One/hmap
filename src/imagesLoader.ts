import { HMapNeighbour, HMapNeighbours } from './neighbours';

export interface HMapImage {
    src: string;
    obj?: HTMLImageElement;
}

export class HMapImagesLoader {
    private images = new Map<string, HMapImage>();

    constructor() {

        // images to preload
        this.images.set('loading', { src: 'https://ryder-one.github.io/hmap/assets/loading.png', obj: undefined });
        this.images.set('glass', { src: 'https://ryder-one.github.io/hmap/assets/glass.png', obj: undefined });
        this.images.set('humanGlow', { src: 'https://ryder-one.github.io/hmap/assets/human_glow.png', obj: undefined });
        this.images.set('map', { src: 'https://ryder-one.github.io/hmap/assets/map.png', obj: undefined });
        this.images.set('moveArrowFill', { src: 'https://ryder-one.github.io/hmap/assets/move_arrow_fill.png', obj: undefined });
        this.images.set('moveArrowLight', { src: 'https://ryder-one.github.io/hmap/assets/move_arrow_light.png', obj: undefined });
        this.images.set('moveArrowOutline', { src: 'https://ryder-one.github.io/hmap/assets/move_arrow_outline.png', obj: undefined });
        this.images.set('night', { src: 'https://ryder-one.github.io/hmap/assets/night.png', obj: undefined });
        this.images.set('shadowFocus', { src: 'https://ryder-one.github.io/hmap/assets/shadow_focus.png', obj: undefined });
        this.images.set('targetArrow', { src: 'https://ryder-one.github.io/hmap/assets/town_arrow.png', obj: undefined });
        this.images.set('zombieGlow', { src: 'https://ryder-one.github.io/hmap/assets/zombie_glow.png', obj: undefined });
        this.images.set('blood', { src: 'https://ryder-one.github.io/hmap/assets/blood.png', obj: undefined });
        this.images.set('single', { src: 'https://ryder-one.github.io/hmap/assets/single.png', obj: undefined });
        this.images.set('hatch', { src: 'https://ryder-one.github.io/hmap/assets/hatch.png', obj: undefined });
        this.images.set('town', { src: 'https://ryder-one.github.io/hmap/assets/town.png', obj: undefined });
        this.images.set('building', { src: 'https://ryder-one.github.io/hmap/assets/building.png', obj: undefined });
        this.images.set('hatch-dense', { src: 'https://ryder-one.github.io/hmap/assets/hatch_dense.png', obj: undefined });
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
        if (!this.get(imageId)) {
        }
        return this.get(imageId).obj;
    }

    /**
      * Preload the pictures and complete the images meta object
      * It will also display the loading animation on the layer BG
      * @param ctx ctx to draw the progressbar evolution or null if no progress bar
      * @param onFinished callback to be called when it's done
      */
     public preloadPictures (ctx: CanvasRenderingContext2D | null, onFinished: CallableFunction) {
        let loaded = 0;

        if (ctx) {
            ctx.fillStyle = '#ebc369';
            ctx.fillText('by ryderone', 120, 195);
        }

        this.images.forEach((value) => {
            if (value.obj === undefined) { // not already loaded, then load it
                const img = new Image();
                img.src = value.src;
                img.onload = () => {
                    if (ctx) {
                        window.requestAnimationFrame(() =>  { // progress bar
                            ctx.fillRect(75, 170, loaded / this.images.size * 155, 6);
                        });
                    }

                    if (++loaded === this.images.size && onFinished) {
                        onFinished(); // when it's done, start the drawing
                    }
                };
                value.obj = img;
            } else { // already loaded, skip it with the same code. That's ugly but I got myself trapped
                if (ctx) {
                    window.requestAnimationFrame(() =>  { // progress bar
                        ctx.fillRect(75, 170, loaded / this.images.size * 155, 6);
                    });
                }
                if (++loaded === this.images.size && onFinished) {
                    onFinished(); // when it's done, start the drawing
                }
            }
        });
    }

    /**
     * Register the buildings to preload the pics
     */
    public registerBuildingsToPreload(neighbours: HMapNeighbours) {
        // register the buildings to draw it later
        neighbours.neighbours.forEach((neighbour: HMapNeighbour) => {
            if (neighbour.building !== 0 && neighbour.building !== undefined && !this.issetImg('b' + neighbour.building)) {
                let url;
                if (neighbour.building === -1) {
                    url = 'https://ryder-one.github.io/hmap/assets/buildings/b_m1.png';
                } else {
                    url = 'https://ryder-one.github.io/hmap/assets/buildings/b_' + neighbour.building + '.png';
                }
                this.set('b' + neighbour.building, {
                    src: url,
                    obj: undefined
                });
            }
        });
    }

}
