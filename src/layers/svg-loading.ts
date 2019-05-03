import { AbstractHMapLayer } from './abstract';
import { HMapAbstractMap } from '../maps/abstract';

/**
 * This layer is dedicated to the loading screen
 */
export class HMapSVGLoadingLayer extends AbstractHMapLayer {

    private loadingBar?: SVGRectElement;

    constructor(map: HMapAbstractMap) {
        super(map);

        const hmap = document.querySelector('#hmap') as HTMLElement;
        if (document.querySelector('#svgLoading') === null && hmap) {
            const SVG = document.createElementNS(this.ns, 'svg');
            SVG.setAttributeNS(null, 'id', 'svgLoading');
            SVG.setAttributeNS(null, 'style', 'position:absolute;z-index:998;');
            hmap.appendChild(SVG);
            SVG.style.pointerEvents = 'none';
        }
        this.svg = document.getElementById('svgLoading') as HTMLObjectElement;
        this.svg.setAttributeNS(null, 'width', map.width  + 'px');
        this.svg.setAttributeNS(null, 'height', map.height  + 'px');
        this.svg.style.width = map.width + 'px';
        this.svg.style.height = map.height + 'px';

        this.type = 'loading';
    }

    draw() {
        const oldGroup = this.g;

        this.g = document.createElementNS(this.ns, 'g');

        const map = this.map;

        this.img(map.imagesLoader.get('loading').src, 0, 0, 300, 300); // image is 300x300

        this.text(120, 185, 'by ryderone', 'hmap-text-yellow');

        this.loadingBar = this.rect(75, 170, 1, 6, '#ebc369');

        this.svg.appendChild(this.g);
        if (oldGroup) {
            window.setTimeout(() => this.svg.removeChild(oldGroup), 100);
        }
    }

    /**
     * Animate the progress bar
     */
    progress(percent: number) {
        this.loadingBar!.setAttributeNS(null, 'width', percent * 155 + ''); // 155 = width of the bar
    }

    /**
     * I dont remove the element from the DOM yet, it may be reused later
     */
    hide(): void {
        this.svg.style.display = 'none';
    }
}
