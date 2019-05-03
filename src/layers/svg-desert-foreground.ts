import { AbstractHMapLayer } from './abstract';
import { HMapDesertMap } from '../maps/desert';

export class HMapSVGDesertForegroundLayer extends AbstractHMapLayer {

    constructor(map: HMapDesertMap) {
        super(map);

        const hmap = document.querySelector('#hmap') as HTMLElement;
        if (document.querySelector('#svgDesertForeground') === null && hmap) {
            const SVG = document.createElementNS(this.ns, 'svg');
            SVG.setAttributeNS(null, 'id', 'svgDesertForeground');
            SVG.setAttributeNS(null, 'style', 'position:absolute;z-index:3;');
            hmap.appendChild(SVG);
        }
        this.svg = document.getElementById('svgDesertForeground') as HTMLObjectElement;
        this.svg.setAttributeNS(null, 'width', map.width + 'px');
        this.svg.setAttributeNS(null, 'height', map.height + 'px');

        this.svg.style.width = map.width + 'px';
        this.svg.style.height = map.height + 'px';
        this.svg.style.pointerEvents = 'none';

        this.type = 'desert-foreground';
    }

    draw() {
        const oldGroup = this.g;
        this.g = document.createElementNS(this.ns, 'g');

        const map = this.map as HMapDesertMap;
        const mapData = this.map.mapData!;
        const imagesLoader = this.map.imagesLoader;

        // focus lens shadow (433x433)
        this.img(imagesLoader.get('shadowFocus').src, (map.width - 433) / 2, (map.height - 433) / 2, 433, 433);

        // arrow pointing toward target
        if (mapData.position.x !== map.target.x || mapData.position.y !== map.target.y) {
            const targetAngle = Math.atan2(map.target.y - mapData.position.y, map.target.x - mapData.position.x);
            this.positionTargetArrow(targetAngle);
        }

        // Destination
        if (mapData.position.x === map.target.x && mapData.position.y === map.target.y) {
            this.img(imagesLoader.get('destination').src, 150 - 6, 150 - 6, 12,  12);
        }

        // blood
        if (!mapData.hasControl) {
            this.img(imagesLoader.get('blood').src, 0, 0, 300, 300);
        }

        this.img(map.imagesLoader.get('glass').src, 0, 0, 300, 300); // image is 300x300

        // position text
        const relativePos = mapData.getPositionRelativeToTown(mapData.position);
        const positionText = 'position : ' + (relativePos.x) + ' / ' + (relativePos.y);
        const positionTextElement = this.text(map.width - 10, map.height - 25, positionText, 'hmap-text-yellow');
        positionTextElement.setAttributeNS(null, 'text-anchor', 'end');
        positionTextElement.style.fontSize = '14px';

        // arrows
        for (let i = 0, j = map.registredArrows.length; i < j; i++) {
            const arrow = map.registredArrows[i];
            const arrowImg = this.img(imagesLoader.get('moveArrowLight').src, arrow.ax, arrow.ay, 82, 27, arrow.a);
            arrowImg.style.pointerEvents = 'auto';
            arrowImg.style.cursor = 'pointer';
            this.img(imagesLoader.get('moveArrowOutline').src, arrow.ax, arrow.ay, 83, 28, arrow.a);
            arrowImg.onmouseenter = () => {
                const arrowFill = this.img(imagesLoader.get('moveArrowFill').src, arrow.ax, arrow.ay, 83, 28, arrow.a);
                arrowFill.setAttributeNS(null, 'class', 'hmap-arrowFill');
            };

            arrowImg.onmouseleave = () => {
                document.querySelectorAll('.hmap-arrowFill').forEach((element) => {
                    element.remove();
                });
            };

            arrowImg.onclick = () => {
                (this.map as HMapDesertMap).move(arrow.t);
            };
        }

        // scout class
        if (mapData.scoutArray && mapData.scoutArray.length === 4) {
            if (mapData.neighbours.neighbours.get('top_center')!.outbounds === false) {
                this.text(148, 30, '' + mapData.scoutArray[0], 'hmap-text-yellow');
            }
            if (mapData.neighbours.neighbours.get('middle_right')!.outbounds === false) {
                this.text(270, 152, '' + mapData.scoutArray[1], 'hmap-text-yellow');
            }
            if (mapData.neighbours.neighbours.get('bottom_center')!.outbounds === false) {
                this.text(148, 270, '' + mapData.scoutArray[2], 'hmap-text-yellow');
            }
            if (mapData.neighbours.neighbours.get('middle_left')!.outbounds === false) {
                this.text(30, 152, '' + mapData.scoutArray[3], 'hmap-text-yellow');
            }
        }
        this.svg.appendChild(this.g);
        if (oldGroup) {
            window.setTimeout(() => this.svg.removeChild(oldGroup), 10);
        }
    }

    /**
     * Draw the small green arrow pointing toward the target
     * The angle is not calculated here
     * @param angle angle precalculated
     */
    private positionTargetArrow(angle: number) {
        let originX = this.map.width / 2 - 4;
        let originY = this.map.height / 2 - 8;
        originX += 120 * Math.cos(angle);
        originY += 120 * Math.sin(angle);

        this.img(this.map.imagesLoader.get('targetArrow').src, originX, originY, 9, 17, angle * 180 / Math.PI);
    }

}
