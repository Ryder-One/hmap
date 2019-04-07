import { HMapAbstractMap } from './abstract';
import { HMapGridLayer } from '../layers/grid';
import { HMapPoint } from '../hmap';

export type HMapGridMode = 'global' | 'perso';

export class HMapGridMap extends HMapAbstractMap {

    public mouse?: HMapPoint;
    public mouseOverIndex = -1;
    public mode = 'perso';


    /**
     * Build the layers (HTML canvas) for this map
     */
    public buildLayers(): void {

        this.jQ('.swf').css('display', 'flex').css('flex-direction', 'column').css('height', 'auto');
        if (!this.jQ('#hmap').length) {
            this.jQ('.swf').append('<div id="hmap"></div>');
            this.jQ('#hmap').css('height', '300px');
        }

        const GridLayer = new HMapGridLayer(this.jQ, this);
        this.layers.set('grid', GridLayer);
        GridLayer.canvas.onmousemove = this.onMouseMove.bind(this);
        GridLayer.canvas.onmouseleave = this.onMouseLeave.bind(this);
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

    private onMouseLeave(e: MouseEvent) {
        this.mouse = { x: 0, y: 0 };
        this.mouseOverIndex = -1;
    }
}
