import { AbstractHMapLayer } from './abstract';
import { HMapDesertMap } from '../maps/desert';
import { HMapRandom } from '../random';
import { HMapNeighbour } from '../neighbours';
import { HMapPoint } from '../hmap';
import { HMapDesertLocalDataJSON, HMapDesertDataJSON, HMapDesertData } from '../data/hmap-desert-data';

export class HMapSVGDesertBackgroundLayer extends AbstractHMapLayer<HMapDesertDataJSON, HMapDesertLocalDataJSON> {

    private translation: HMapPoint = {x : 0, y : 0}; // translation really applied

    private parallax: HMapPoint = { x: 0, y: 0 }; // parallax effect

    // variables to do the translation on arrow click
    private startTranslate?: number; // timestamp
    private translateTo: HMapPoint = { x: 0, y: 0 }; // target (translation to achieve after easing)
    private intervalEasing?: number;

    constructor(map: HMapDesertMap) {
        super(map);

        const hmap = document.querySelector('#hmap') as HTMLElement;
        if (document.querySelector('#svgDesertBackground') === null && hmap) {
            const SVG = document.createElementNS(this.ns, 'svg');
            SVG.setAttributeNS(null, 'id', 'svgDesertBackground');
            SVG.setAttributeNS(null, 'style', 'position:absolute;z-index:2;');
            hmap.appendChild(SVG);
        }
        this.svg = document.getElementById('svgDesertBackground') as HTMLObjectElement;
        this.svg.setAttributeNS(null, 'width', map.width + 'px');
        this.svg.setAttributeNS(null, 'height', map.height + 'px');

        this.svg.style.width = map.width + 'px';
        this.svg.style.height = map.height + 'px';

        this.type = 'desert-background';
    }

    onMouseMove(e: MouseEvent) {
        if (this.translateTo.x !== 0 || this.translateTo.y !== 0 || !this.g) {
            return;
        }
        const rect = this.svg.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const centerX = 150;
        const centerY = 150;

        this.parallax.x = Math.floor(-1 * (centerX - mouseX) / 10);
        this.parallax.y = Math.floor(-1 * (centerY - mouseY) / 10);

        this.translation.x = this.parallax.x;
        this.translation.y = this.parallax.y;

        this.g.setAttributeNS(null, 'transform', 'translate(' + -1 * this.translation.x + ' ' + -1 * this.translation.y + ')');
    }

    onMouseLeave(e: MouseEvent) {
        const rect = this.svg.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        if (mouseX < 1 || mouseY < 1 || mouseX >= this.map.width * 0.98 || mouseY >= this.map.height * 0.98) { // if the mouse is outside
            this.parallax.x = 0;
            this.parallax.y = 0;
            this.translation = {x : 0, y : 0};
            this.g.setAttributeNS(null, 'transform', 'translate(' + -1 * this.translation.x + ' ' + -1 * this.translation.y + ')');
        }
    }

    easeMovement(target: HMapPoint, callback: CallableFunction) {

        this.startTranslate = Date.now();
        this.translateTo = target;

        if (!this.intervalEasing) {
            this.intervalEasing = window.setInterval(() => {
                // translation effect when we click on an arrow
                let coef = 1; // this will be increasing from 0 to 1
                if (this.startTranslate) {
                    const p = (Date.now() - this.startTranslate) / 300; // 300ms
                    coef = p >= 1 ? 1 : 1 - Math.pow(2, - 10 * p); // exp easing
                } else {
                    throw new Error('Cannot ease without starting the translation');
                }

                const translateX = this.translateTo.x + this.parallax.x;
                const translateY = this.translateTo.y + this.parallax.y;

                this.translation.x = translateX * coef;
                this.translation.y = translateY * coef;

                this.g.setAttributeNS(null, 'transform', 'translate(' + -1 * this.translation.x + ' ' + -1 * this.translation.y + ')');

                if (coef >= 1) { // the motion is over, reset the variables
                    this.startTranslate = undefined;
                    this.translateTo = {x: 0, y: 0};
                    clearInterval(this.intervalEasing);
                    this.intervalEasing = undefined;
                    callback();
                    // no need to reset the translation, it will be done by the draw function
                    return;
                }
            }, 40);
        }
    }

    draw() {
        const oldGroup = this.g;
        this.g = document.createElementNS(this.ns, 'g');

        const map = this.map;
        const mapData = this.map.mapData as HMapDesertData;

        const seed = mapData.zoneId;
        const random = new HMapRandom(seed);
        const neighbours = mapData.neighbours;

        const center = { x: map.width / 2, y: map.height / 2 };
        const position = mapData.position;
        const numberOfHumans = mapData.numberOfHumans;
        const numberOfZombies = mapData.numberOfZombies;

        // first thing first, the background
        this.imgFromObj('map', -100 * (position.x % 6) - 25, -100 * (position.y % 6) - 25);

        // buildings
        neighbours.neighbours.forEach((neighbour: HMapNeighbour) => {
            if (neighbour.building !== 0 && neighbour.building !== null) {
                const building = this.imgFromObj('b' + neighbour.building, neighbour.offsetX, neighbour.offsetY);
                building.setAttributeNS(null, 'hmap-bid', neighbour.building + '');
                building.setAttributeNS(null, 'hmap-x', neighbour.offsetX + '');
                building.setAttributeNS(null, 'hmap-y', neighbour.offsetY + '');
                building.style.pointerEvents = 'auto';
                building.onmouseenter = this.showPopupBuilding.bind(this);
                building.onmouseleave = this.hidePopupBuilding.bind(this);
            }
        });

        // night filter
        if (mapData.hour < 7 || mapData.hour > 18) {
            this.imgFromObj('night', -25, -25);
        }

        // humans
        this.imgFromObj('humanGlow', 141, 141); // you
        for (let k = 1; k <= numberOfHumans - 1; k++) { // others
            const newPosH = random.randomCircle(center, Math.floor(random.random() * 30) + 5);
            this.imgFromObj('humanGlow', newPosH.x, newPosH.y);
        }

        // zombies
        for (let n = 1; n <= numberOfZombies; n++) {
            const newPosZ = random.randomCircle(center, Math.floor(random.random() * 40) + 5 );
            this.imgFromObj('zombieGlow', newPosZ.x, newPosZ.y);
        }

        // fog of war
        for (let i = mapData.position.x - 2; i < mapData.position.x + 3; i++) {
            for (let j = mapData.position.y - 2; j < mapData.position.y + 3; j++) {
                const point = {x : i, y : j};
                if (!mapData.inBounds(point) || !mapData.isPositionDiscovered(point)) {
                    let oX = 0, oY = 0;
                    if (j - mapData.position.y === 0 && i > mapData.position.x) {
                        oX = 15;
                    } else if (j - mapData.position.y === 0 && i < mapData.position.x) {
                        oX = -15;
                    } else if (i - mapData.position.x === 0 && j > mapData.position.y) {
                        oY = 15;
                    } else if (i - mapData.position.x === 0 && j < mapData.position.y) {
                        oY = -15;
                    }
                    const offsetX = (i - mapData.position.x + 1) * 100;
                    const offsetY = (j - mapData.position.y + 1) * 100;
                    if (!(offsetX === 100 && offsetY === 100)) {
                        this.imgFromObj('single', offsetX - 50 + oX, offsetY - 50 + oY);
                    }
                }
            }
        }

        this.translation.x = this.parallax.x;
        this.translation.y = this.parallax.y;
        this.g.setAttributeNS(null, 'transform', 'translate(' + -1 * this.translation.x + ' ' + -1 * this.translation.y + ')');

        this.svg.appendChild(this.g);
        if (oldGroup) {
            window.setTimeout(() => this.svg.removeChild(oldGroup), 300); // avoid flickering by deleting former group 300ms after
        }
    }

    /**
     * Display the popup on building roll over
     */
    private showPopupBuilding(e: MouseEvent) {
        // create a canvas to measure text, because SVG sucks at it
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        ctx.font = '13px visitor2';

        const target = e.target as SVGRectElement;
        const buildingId = +target.getAttributeNS(null, 'hmap-bid')!;

        const map = this.map;
        const mapData = map.mapData as HMapDesertData;

        const buildingName = (buildingId === 1) ? mapData.townName : mapData.buildings.get(buildingId)!;

        const textWidth = ctx.measureText(buildingName).width;

        const x = +target.getAttributeNS(null, 'hmap-x')! + 50;
        const y = +target.getAttributeNS(null, 'hmap-y')! + 85;

        // start the drawing of the popup itself
        const popupWidth = Math.floor(textWidth + 10);
        const popupHeight = 16;
        const minWidthHeight = Math.min(map.width, map.height);
        const xPopup = Math.floor(Math.min( Math.max(x - popupWidth / 2, 0), minWidthHeight - popupWidth));
        const yPopup = Math.max(y - popupHeight, 0) | 0;

        // draw the rect
        const popup: SVGRectElement = this.rect(xPopup, yPopup, popupWidth, popupHeight, '#000000', '#b9ba3e', 1);
        popup.setAttributeNS(null, 'fill-opacity', '0.6');
        popup.setAttributeNS(null, 'class', 'hmap-popup');
        popup.style.pointerEvents = 'none';

        // draw the text
        this.text(
            xPopup + popupWidth / 2 - textWidth / 2,
            yPopup + 8,
            buildingName,
            'hmap-text-green hmap-popup');

        document.querySelectorAll('.hmap-popup').forEach((element) => {
            (element as HTMLElement).style.zIndex = '11';
        });
    }

    private hidePopupBuilding(e: MouseEvent) {
        document.querySelectorAll('.hmap-popup').forEach((element) => {
            element.remove();
        });
    }
}
