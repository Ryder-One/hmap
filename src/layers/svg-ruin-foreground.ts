import { AbstractHMapLayer } from './abstract';
import { HMapRuinDataJSON, HMapRuinLocalDataJSON, HMapRuinData } from '../data/hmap-ruin-data';
import { HMapRuin } from '../maps/ruin';
import { HMapLang } from '../lang';
import { HMapRandom } from '../random';

/**
 * This layer is dedicated to the loading screen
 */
export class HMapSVGRuinForegroundLayer extends AbstractHMapLayer<HMapRuinDataJSON, HMapRuinLocalDataJSON> {
    private lowOxygen = false;

    constructor(map: HMapRuin) {
        super(map);

        const hmap = document.querySelector('#hmap') as HTMLElement;
        if (document.querySelector('#svgRuinForeground') === null && hmap) {
            const SVG = document.createElementNS(this.ns, 'svg');
            SVG.setAttributeNS(null, 'id', 'svgRuinForeground');
            SVG.setAttributeNS(null, 'style', 'position:absolute;z-index:998;');
            hmap.appendChild(SVG);
            SVG.style.pointerEvents = 'none';
        }
        this.svg = document.getElementById('svgRuinForeground') as HTMLObjectElement;
        this.svg.setAttributeNS(null, 'width', map.width  + 'px');
        this.svg.setAttributeNS(null, 'height', map.height  + 'px');
        this.svg.style.width = map.width + 'px';
        this.svg.style.height = map.height + 'px';

        this.type = 'ruin-foreground';
    }

    draw() {
        const oldGroup = this.g;
        this.g = document.createElementNS(this.ns, 'g');

        const map = this.map as HMapRuin;
        const mapData = this.map.mapData as HMapRuinData;

        // scanner
        this.imgFromObj('scanner', 250, 250);

        // focus lens shadow (433x433)
        this.imgFromObj('shadowFocus', (map.width - 433) / 2, (map.height - 433) / 2);
        this.imgFromObj('shadowFocus', (map.width - 433) / 2, (map.height - 433) / 2);

        // green rects
        this.rect(6, 6, map.width - 12, map.height - 25, 'transparent', '#188400', 1);
        this.rect(4, 4, map.width - 8, map.height - 21, 'transparent', '#1a4e02', 1);

        // glass
        this.imgFromObj('glass', 0, 0); // image is 300x300

        const oxygenText = this.text(map.width - 10, 14, HMapLang.get('oxygen') + ' :', 'hmap-text-green');
        oxygenText.setAttributeNS(null, 'text-anchor', 'end');
        oxygenText.setAttributeNS(null, 'style', 'fill:#188300;');

        // glass
        const oxygenUnitO = this.text(map.width - 14, 27, 'O', 'hmap-text-green');
        oxygenUnitO.setAttributeNS(null, 'style', 'font-size: 20px;');
        oxygenUnitO.setAttributeNS(null, 'text-anchor', 'end');
        const oxygenUnit2 = this.text(map.width - 10, 32, '2', 'hmap-text-green');
        oxygenUnit2.setAttributeNS(null, 'style', 'font-size: 10px;');
        oxygenUnit2.setAttributeNS(null, 'text-anchor', 'end');
        oxygenUnit2.setAttributeNS(null, 'dominant-baseline', 'baseline');

        const oxygenValue = this.text(map.width - 27, 27, '100', 'hmap-text-green');
        oxygenValue.setAttributeNS(null, 'style', 'font-size: 20px;');
        oxygenValue.setAttributeNS(null, 'text-anchor', 'end');
        oxygenValue.setAttributeNS(null, 'id', 'hmap-oxygen');

        // arrows
        this.updateArrows();

        // title
        const random = new HMapRandom(mapData.zoneId);
        const possibleNames = HMapLang.getInstance().getRuinNames(mapData.ruinType);
        const index = random.getRandomIntegerLocalSeed(0, possibleNames.length - 1);
        const title = this.text(10, 15, possibleNames[index], 'hmap-text-green');
        title.setAttributeNS(null, 'style', 'fill:#188300;');


        this.svg.appendChild(this.g);
        if (oldGroup) {
            window.setTimeout(() => this.svg.removeChild(oldGroup), 100);
        }
    }

    updateOxygen() {
        const map = this.map as HMapRuin;
        const mapData = this.map.mapData as HMapRuinData;

        const percent = Math.floor(mapData.oxygen / 3000);

        const textElement = document.getElementById('hmap-oxygen');
        if (textElement) {
            textElement.textContent = '' + percent;
        }
        if (percent < 15) {
            if (!this.lowOxygen) {
                this.lowOxygen = true;
                const you = document.querySelector( '#hmap-ruin-you' );
                if (you) {
                    you.parentNode!.removeChild( you );
                }
                this.imgFromObj('you-noox', 142, 133);
            }
        }
    }

    updateArrows() {
        // remove existing arrows
        const existingArrows = document.querySelectorAll( '.hmap-arrow' );
        if (existingArrows) {
            existingArrows.forEach(el => el.parentNode!.removeChild( el ));
        }

        // build new ones
        const map = this.map as HMapRuin;

        for (let i = 0, j = map.registredArrows.length; i < j; i++) {
            const arrow = map.registredArrows[i];
            const arrowImg = this.imgFromObj('moveArrowLight', arrow.ax, arrow.ay, arrow.a, 'hmap-arrow');
            arrowImg.style.pointerEvents = 'auto';
            arrowImg.style.cursor = 'pointer';
            this.imgFromObj('moveArrowOutline', arrow.ax, arrow.ay, arrow.a, 'hmap-arrow');
            arrowImg.onmouseenter = () => {
                this.imgFromObj('moveArrowLight', arrow.ax, arrow.ay, arrow.a, 'hmap-arrow hmap-arrowFill');
            };

            arrowImg.onmouseleave = () => {
                document.querySelectorAll('.hmap-arrowFill').forEach((element) => {
                    element.remove();
                });
            };

            arrowImg.onclick = () => {
                if ((this.map.mapData as HMapRuinData).room === true) {
                    (this.map as HMapRuin).exitRoom(); // if we are in a room, a move will exit the room
                } else {
                    (this.map as HMapRuin).move(arrow.t); // else, execute the move in the given direction
                }
            };
        }
    }
}
