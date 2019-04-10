import { HMapAbstractMap } from './abstract';
import { HMapGridLayer } from '../layers/grid';
import { HMapPoint } from '../hmap';

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

        this.jQ('.swf').css('display', 'flex').css('flex-direction', 'column').css('height', 'auto');
        if (!this.jQ('#hmap').length) {
            this.jQ('.swf').append('<div id="hmap"></div>');
            this.jQ('#hmap').css('height', '300px').css('position', 'relative');

            // create the menu
            this.jQ('#hmap').append('<div id="hmap-menu"></div>');
            this.jQ('#hmap-menu')
                .css('position', 'absolute')
                .css('bottom', '0px')
                .css('z-index', '10')
                .css('height', '20px')
                .css('display', 'none');

            // create the buttons
            if (this.enableClose) {
                this.jQ('#hmap-menu').append('<div id="hmap-close-button" class="hmap-button">Close</div>');
            }
            this.jQ('#hmap-menu').append('<div id="hmap-mode-button" class="hmap-button"></div>');

            if (this.mode === 'global') {
                this.jQ('#hmap-mode-button').html('Personal');
            } else {
                this.jQ('#hmap-mode-button').html('Global');
            }

            // bind the clicks
            if (this.enableClose) {
                this.jQ('#hmap-close-button').on('click', this.onMapButtonClick.bind(this));
            }
            this.jQ('#hmap-mode-button').on('click', this.switchMode.bind(this));

            // style the buttons
            this.jQ('div.hmap-button').on('mouseenter', (e: JQuery.MouseEnterEvent) => {
                this.jQ(e.target).css('outline', '1px solid #eccb94');
            }).on('mouseleave', (e: JQuery.MouseLeaveEvent) => {
                this.jQ(e.target).css('outline', '0px');
            });

            this.jQ('div.hmap-button')
                .css('padding', '0px 5px')
                .css('margin', '2px 5px')
                .css('border', '1px solid black')
                .css('background-color', '#a13119')
                .css('font-size', '13px')
                .css('font-weight', '700')
                .css('font-family', 'economica')
                .css('color', '#eccb94')
                .css('cursor', 'pointer')
                .css('display', 'flex')
                .css('align-items', 'center')
                .css('user-select', 'none');
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
            this.jQ('#hmap-menu').css('display', 'flex');
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

    private onMapButtonClick() {
        this.hmap.switchMapAndReload('desert');
    }

    private switchMode() {
        if (this.mode === 'global') {
            this.mode = 'personal';
            this.jQ('#hmap-mode-button').html('Global');
        } else {
            this.mode = 'global';
            this.jQ('#hmap-mode-button').html('Personal');
        }
    }
}
