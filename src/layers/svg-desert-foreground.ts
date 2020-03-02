import { AbstractHMapLayer } from './abstract';
import { HMapDesertMap } from '../maps/desert';
import { HMapDesertDataJSON, HMapDesertLocalDataJSON, HMapDesertData } from '../data/hmap-desert-data';
import { HMapLang } from '../lang';

export class HMapSVGDesertForegroundLayer extends AbstractHMapLayer<HMapDesertDataJSON, HMapDesertLocalDataJSON> {

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
        const mapData = this.map.mapData as HMapDesertData;

        // focus lens shadow (433x433)
        this.imgFromObj('shadowFocus', (map.width - 433) / 2, (map.height - 433) / 2);

        // arrow pointing toward target
        if (mapData.position.x !== map.target.x || mapData.position.y !== map.target.y) {
            const targetAngle = Math.atan2(map.target.y - mapData.position.y, map.target.x - mapData.position.x);
            this.positionTargetArrow(targetAngle);
        }

        // Destination
        if (mapData.position.x === map.target.x && mapData.position.y === map.target.y) {
            this.imgFromObj('destination', 150 - 6, 150 - 6);
        }

        // blood
        if (!mapData.hasControl) {
            this.imgFromObj('blood', 0, 0);
        }

        this.imgFromObj('glass', 0, 0); // image is 300x300

        // position text
        const relativePos = mapData.getPositionRelativeToTown(mapData.position);
        const positionText = HMapLang.get('position') + ' : ' + (relativePos.x) + ' / ' + (relativePos.y);
        const positionTextElement = this.text(map.width - 10, map.height - 25, positionText, 'hmap-text-green');
        positionTextElement.setAttributeNS(null, 'text-anchor', 'end');
        positionTextElement.style.fontSize = '14px';

        // arrows
        for (let i = 0, j = map.registredArrows.length; i < j; i++) {
            const arrow = map.registredArrows[i];
            const arrowImg = this.imgFromObj('moveArrowLight', arrow.ax, arrow.ay, arrow.a);
            arrowImg.style.pointerEvents = 'auto';
            arrowImg.style.cursor = 'pointer';
            this.imgFromObj('moveArrowOutline', arrow.ax, arrow.ay, arrow.a);
            arrowImg.onmouseenter = () => {
                const arrowFill = this.imgFromObj('moveArrowLight', arrow.ax, arrow.ay, arrow.a);
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
                this.text(148, 30, '' + mapData.scoutArray[0], 'hmap-text-green');
            }
            if (mapData.neighbours.neighbours.get('middle_right')!.outbounds === false) {
                this.text(270, 150, '' + mapData.scoutArray[1], 'hmap-text-green');
            }
            if (mapData.neighbours.neighbours.get('bottom_center')!.outbounds === false) {
                this.text(148, 270, '' + mapData.scoutArray[2], 'hmap-text-green');
            }
            if (mapData.neighbours.neighbours.get('middle_left')!.outbounds === false) {
                this.text(30, 150, '' + mapData.scoutArray[3], 'hmap-text-green');
            }
        }

        // scavenger class
        if (mapData.scavengerArray && mapData.scavengerArray.length === 4) {
            if (mapData.scavengerArray[0] === true) {
                this.imgFromObj('shovel', 142, 24);
            } else if (mapData.scavengerArray[0] === false) {
                this.imgFromObj('depleted', 142, 24);
            }

            if (mapData.scavengerArray[1] === true) {
                this.imgFromObj('shovel', 263, 142);
            } else if (mapData.scavengerArray[1] === false) {
                this.imgFromObj('depleted', 263, 142);
            }

            if (mapData.scavengerArray[2] === true) {
                this.imgFromObj('shovel', 142, 256);
            } else if (mapData.scavengerArray[2] === false) {
                this.imgFromObj('depleted', 142, 256);
            }

            if (mapData.scavengerArray[3] === true) {
                this.imgFromObj('shovel', 26, 142);
            } else if (mapData.scavengerArray[3] === false) {
                this.imgFromObj('depleted', 26, 142);
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

        this.imgFromObj('targetArrow', originX, originY, angle * 180 / Math.PI);
    }

}
