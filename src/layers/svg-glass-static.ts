import { AbstractHMapLayer } from './abstract';
import { HMapGridMap } from '../maps/grid';
import { HMapDesertLocalDataJSON, HMapDesertDataJSON } from '../data/hmap-desert-data';

/**
 * This layer is independant to avoid beeing moved by the zoom/pan behavior
 * We won't reuse this for the other map since this is a bit overkill
 */
export class HMapSVGGlassStaticLayer extends AbstractHMapLayer<HMapDesertDataJSON, HMapDesertLocalDataJSON> {

    constructor(map: HMapGridMap) {
        super(map);

        const hmap = document.querySelector('#hmap') as HTMLElement;
        if (document.querySelector('#svgGlassStatic') === null && hmap) {
            const SVG = document.createElementNS(this.ns, 'svg');
            SVG.setAttributeNS(null, 'id', 'svgGlassStatic');
            SVG.setAttributeNS(null, 'style', 'position:absolute;z-index:3;');
            hmap.appendChild(SVG);
            SVG.style.pointerEvents = 'none';
        }
        this.svg = document.getElementById('svgGlassStatic') as HTMLObjectElement;
        this.svg.setAttributeNS(null, 'width', map.width  + 'px');
        this.svg.setAttributeNS(null, 'height', map.height  + 'px');
        this.svg.style.width = map.width + 'px';
        this.svg.style.height = map.height + 'px';

        this.type = 'glass-static';
    }

    draw() {
        const oldGroup = this.g; // delete the group after drawing the new one to avoid flickering
        this.g = document.createElementNS(this.ns, 'g');
        this.img(this.map.imagesLoader.get('glass').src, 0, 0, 300, 300, );
        this.svg.appendChild(this.g);
        if (oldGroup) {
            this.svg.removeChild(oldGroup);
        }
    }
}
