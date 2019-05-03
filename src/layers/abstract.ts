import { HMapAbstractMap } from '../maps/abstract';

export type HMapLayerSVGType = 'loading' | 'grid' | 'glass-static' | 'desert-background' | 'desert-foreground';

export abstract class AbstractHMapLayer {

    public svg!: HTMLObjectElement; // assigned in derivated class
    protected g!: SVGElement; // contains the main drawing
    protected type!: HMapLayerSVGType; // assigned in derivated class
    protected map: HMapAbstractMap;

    protected readonly ns = 'http://www.w3.org/2000/svg';

    constructor(map: HMapAbstractMap) {
        this.map = map;
    }

    /**
     * Draw a rect onto the SVG, append it to the main group and return it
     */
    protected rect(x: number, y: number, width: number, height: number, fill?: string, stroke?: string, strokeWidth = 2): SVGRectElement {
        const rect = document.createElementNS(this.ns, 'rect');
        rect.setAttributeNS(null, 'x', x + '');
        rect.setAttributeNS(null, 'y', y + '');
        rect.setAttributeNS(null, 'width', width + '');
        rect.setAttributeNS(null, 'height', height + '');
        if (fill !== undefined) {
            rect.setAttributeNS(null, 'fill', fill);
        }
        if (stroke !== undefined) {
            rect.setAttributeNS(null, 'stroke', stroke);
            rect.setAttributeNS(null, 'stroke-width', strokeWidth + '');
        }
        rect.setAttributeNS(null, 'shape-rendering', 'crispEdges');
        this.g.appendChild(rect);
        return rect;
    }

    /**
     * Draw a path onto the SVG, append it to the main group and return it
     */
    protected path(d: string): SVGPathElement {
        const path = document.createElementNS(this.ns, 'path');
        path.setAttributeNS(null, 'd', d);
        this.g.appendChild(path);
        return path;
    }

    /**
     * Embbed an image in the SVG; append it to the main group and return it
     */
    protected img (url: string, x: number, y: number, width: number, height: number, angle?: number): SVGImageElement {
        const img = document.createElementNS(this.ns, 'image');
        img.setAttributeNS(null, 'height', height + '');
        img.setAttributeNS(null, 'width', width + '');
        img.setAttributeNS('http://www.w3.org/1999/xlink', 'href', url);
        img.setAttributeNS(null, 'x', x + '');
        img.setAttributeNS(null, 'y', y + '');
        img.setAttributeNS(null, 'shape-rendering', 'crispEdges');
        img.style.pointerEvents = 'none';
        this.g.appendChild(img);

        if (angle && width && height) {
            img.setAttributeNS(null, 'transform', 'rotate(' + angle + ' ' + (x + width / 2) + ' ' + (y + height / 2) + ')');
        }
        return img;
    }

    /**
     * Draw a text on the SVG and return it
     */
    protected textDetached (x: number, y: number, text: string, cssclass?: string): SVGTextElement {
        const element = document.createElementNS(this.ns, 'text');
        element.setAttributeNS(null, 'x', x + '');
        element.setAttributeNS(null, 'y', y + '');
        element.setAttributeNS(null, 'shape-rendering', 'crispEdges');
        element.setAttributeNS(null, 'dominant-baseline', 'middle');
        const txt = document.createTextNode(text);
        element.appendChild(txt);
        element.style.pointerEvents = 'none';
        element.style.userSelect = 'none';
        if (cssclass) {
            element.setAttributeNS(null, 'class', cssclass);
        }
        return element;
    }

    /**
     * Draw a text on the SVG, append it to the main group and return it
     */
    protected text (x: number, y: number, text: string, cssclass?: string) {
        const txt = this.textDetached(x, y, text, cssclass);
        this.g.appendChild(txt);
        return txt;
    }

    public abstract draw(): void;
}
