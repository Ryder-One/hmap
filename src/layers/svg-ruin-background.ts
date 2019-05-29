import { AbstractHMapLayer } from './abstract';
import { HMapRuinDataJSON, HMapRuinLocalDataJSON, HMapRuinData } from '../data/hmap-ruin-data';
import { HMapRuin } from '../maps/ruin';
import { HMapPoint } from '../hmap';
import { HMapRandom } from '../random';

// Here are all the possible walls
//      D       E
//      |  Z2   |
// B____|___F___|___ G
//      |       |
//  Z1 C|  Z5   |I Z3
// A____|_______|___ H
//      |   L   |
//      |  Z4   |
//      K       J
type HMapWallNumber = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L';
type HMapZoneNumber = 'Z1' | 'Z2' | 'Z3' | 'Z4' | 'Z5';

/**
 * This layer is dedicated to the loading screen
 */
export class HMapSVGRuinBackgroundLayer extends AbstractHMapLayer<HMapRuinDataJSON, HMapRuinLocalDataJSON> {

    private translation: HMapPoint = {x : 0, y : 0}; // translation really applied

    // variables to do the translation on arrow click
    private startTranslate?: number; // timestamp
    private translateTo: HMapPoint = { x: 0, y: 0 }; // target (translation to achieve after easing)
    private intervalEasing?: number;

    constructor(map: HMapRuin) {
        super(map);

        const hmap = document.querySelector('#hmap') as HTMLElement;
        if (document.querySelector('#svgRuin') === null && hmap) {
            const SVG = document.createElementNS(this.ns, 'svg');
            SVG.setAttributeNS(null, 'id', 'svgRuin');
            SVG.setAttributeNS(null, 'style', 'position:absolute;z-index:10;');
            hmap.appendChild(SVG);
            SVG.style.pointerEvents = 'none';
        }
        this.svg = document.getElementById('svgRuin') as HTMLObjectElement;
        this.svg.setAttributeNS(null, 'width', map.width  + 'px');
        this.svg.setAttributeNS(null, 'height', map.height  + 'px');
        this.svg.style.width = map.width + 'px';
        this.svg.style.height = map.height + 'px';

        this.type = 'ruin-background';
    }

    draw() {
        const oldGroup = this.g;

        this.g = document.createElementNS(this.ns, 'g');

        const map = this.map as HMapRuin;
        const mapData = this.map.mapData as HMapRuinData;
        const imagesLoader = map.imagesLoader;
        const center = { x: map.width / 2, y: map.height / 2 };

        const directions = mapData.directionsStr;

        const walls = this.availableWalls();
        const zones = this.availableZones();

        this.img(imagesLoader.get(directions).src, 0, 0, 300, 300);

        // the main door
        if (mapData.exit) {
            this.img(imagesLoader.get('exit').src, 117, 90, 64, 60);
        }

        if (mapData.room) {
            console.log(mapData.room, walls, zones);
            
        }

        // you
        const you = this.img(imagesLoader.get('you').src, 142, 136, 16, 32);
        you.setAttributeNS(null, 'id', 'hmap-ruin-you');

        // zombies
        const random = new HMapRandom(mapData.seed);

        for (let n = 1; n <= mapData.zombies; n++) {
            const newPosZ = random.randomCircle(center, Math.floor(random.random() * 20) + 5 );
            this.img(imagesLoader.get('zombiegif').src, newPosZ.x, newPosZ.y, 25, 38);
        }

        this.svg.appendChild(this.g);
        if (oldGroup) {
            window.setTimeout(() => this.svg.removeChild(oldGroup), 100);
        }
    }

    appendNextTile(shiftX: number, shiftY: number, dirs: Array<Boolean>) {
        const map = this.map as HMapRuin;
        const imagesLoader = map.imagesLoader;

        const directions = '' + (+dirs[0]) + (+dirs[1]) + (+dirs[2]) + (+dirs[3]);

        this.img(imagesLoader.get(directions).src, shiftX * 300, shiftY * 300, 300, 300);
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

                const translateX = this.translateTo.x;
                const translateY = this.translateTo.y;

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

    /**
     * Get the available walls to put elements (doors or furnitures) on it
     */
    private availableWalls(): Array<HMapWallNumber> {
        const mapData = this.map.mapData as HMapRuinData;
        const directions = mapData.directions;
        const walls = new Array();
        if (directions[0] === true) {
            walls.push('A');
            walls.push('B');
        } else {
            walls.push('C');
        }
        if (directions[1] === true) {
            walls.push('D');
            walls.push('E');
        } else {
            walls.push('F');
        }
        if (directions[2] === true) {
            walls.push('G');
            walls.push('H');
        } else {
            walls.push('I');
        }
        if (directions[3] === true) {
            walls.push('J');
            walls.push('K');
        } else {
            walls.push('L');
        }
        return walls;
    }

    private availableZones(): Array<HMapZoneNumber> {
        const mapData = this.map.mapData as HMapRuinData;
        const directions = mapData.directions;
        const zones = new Array();
        zones.push('Z5');
        if (directions[0] === true) {
            zones.push('Z1');
        }
        if (directions[1] === true) {
            zones.push('Z2');
        }
        if (directions[2] === true) {
            zones.push('Z3');
        }
        if (directions[3] === true) {
            zones.push('Z4');
        }
        return zones;
    }
}
