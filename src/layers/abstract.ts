import { HMapTypeMap } from '../maps/abstract';

export type HMapLayerType = 'background' | 'foreground' | 'buffer' | 'grid';

/**
 * HTML5 canvas wrapper
 */
export abstract class AbstractHMapLayer {

    public canvas!: HTMLCanvasElement; // assigned in derivated class
    protected jQ: JQueryStatic;
    protected type!: HMapLayerType; // assigned in derivated class
    protected map: HMapTypeMap;

    get ctx(): CanvasRenderingContext2D {
        return this.canvas.getContext('2d', {alpha: false})!; // assuming the canvas is always defined, the ctx should be always defined
    }

    constructor(jQ: JQueryStatic, map: HMapTypeMap) {
        this.jQ = jQ;
        this.map = map;
    }

    public abstract draw(): void;

    /**
     * Draw an image and rotate it on position. The angle is in degree
     */
    public drawImageRot(img: HTMLImageElement | undefined, x: number, y: number, width: number, height: number, angle: number) {
        const rad = angle * Math.PI / 180;
        this.ctx.translate(x + width / 2, y + height / 2); // Set the origin to the center of the image
        this.ctx.rotate(rad); // Rotate the canvas around the origin
        this.drawImage(img, width / 2 * (-1), height / 2 * (-1), width, height); // draw the image
        this.ctx.rotate(rad * ( -1 ) ); // reset the canvas
        this.ctx.translate((x + width / 2) * (-1), (y + height / 2) * (-1));
    }

    /**
     * Draw an image
     */
    public drawImage(img: HTMLImageElement | undefined, x: number, y: number, width?: number, height?: number) {
        if (img === undefined) {
            throw new Error('HMapLayer::drawImage - Image not loaded');
        } else if ((width === undefined && height !== undefined) || (width !== undefined && height === undefined)) {
            throw new Error('HMapLayer::drawImage - if you specify width you must specify height');
        }

        if (width !== undefined && height !== undefined) {
            this.ctx.drawImage(img, x, y, width, height); // draw the image
        } else {
            this.ctx.drawImage(img, x, y); // draw the image
        }
    }
}
