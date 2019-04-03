import { HMapNeighbour, HMapNeighbours } from './neighbours';

export interface HMapImage {
    src: string;
    obj?: HTMLImageElement;
}

export class HMapImagesLoader {
    private images = new Map<string, HMapImage>();

    constructor() {

        // images to preload
        this.images.set('loading', { src: 'https://u.cubeupload.com/ryderone/loading.png', obj: undefined });
        this.images.set('glass', { src: 'https://u.cubeupload.com/ryderone/glass.png', obj: undefined });
        this.images.set('humanGlow', { src: 'https://u.cubeupload.com/ryderone/humanglow.png', obj: undefined });
        this.images.set('map', { src: 'https://u.cubeupload.com/ryderone/map.png', obj: undefined });
        this.images.set('moveArrowFill', { src: 'https://u.cubeupload.com/ryderone/movearrowfill.png', obj: undefined });
        this.images.set('moveArrowLight', { src: 'https://u.cubeupload.com/ryderone/movearrowlight.png', obj: undefined });
        this.images.set('moveArrowOutline', { src: 'https://u.cubeupload.com/ryderone/movearrowoutline.png', obj: undefined });
        this.images.set('night', { src: 'https://u.cubeupload.com/ryderone/night.png', obj: undefined });
        this.images.set('shadowFocus', { src: 'https://u.cubeupload.com/ryderone/shadowfocus.png', obj: undefined });
        this.images.set('townArrow', { src: 'https://u.cubeupload.com/ryderone/townarrow.png', obj: undefined });
        this.images.set('zombieGlow', { src: 'https://u.cubeupload.com/ryderone/zombieglow.png', obj: undefined });
        this.images.set('blood', { src: 'https://u.cubeupload.com/ryderone/blood.png', obj: undefined });
        this.images.set('single', { src: 'http://u.cubeupload.com/ryderone/single.png', obj: undefined });
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
                    url = 'https://u.cubeupload.com/ryderone/bm1.png';
                } else {
                    url = 'https://u.cubeupload.com/ryderone/b' + neighbour.building + '.png';
                }
                this.set('b' + neighbour.building, {
                    src: url,
                    obj: undefined
                });
            }
        });
    }

}
