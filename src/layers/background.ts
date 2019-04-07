import { AbstractHMapLayer } from './abstract';
import { HMapRandom } from '../random';
import { HMapNeighbour } from '../neighbours';
import { HMapDesertMap } from '../maps/desert';

export class HMapBackgroundLayer extends AbstractHMapLayer {

    constructor(jQ: JQueryStatic, map: HMapDesertMap) {
        super(jQ, map);

        if (!jQ('#canvasBG').length) {
            jQ('#hmap').append('<canvas id="canvasBG" width="300px" height="300px" style="position:absolute;z-index:0;"></canvas>');
        }
        this.canvas = document.getElementById('canvasBG') as HTMLCanvasElement;
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.font = '14px visitor2';
        this.type = 'background';
    }

    public draw() {
        const mapData = this.map.mapData!;

        const imagesLoader = this.map.imagesLoader;
        const seed = mapData.zoneId;
        const random = new HMapRandom(seed);
        const neighbours = mapData.neighbours;

        this.ctx.clearRect(0, 0, 300, 300);

        const center = { x: 150, y: 150 };
        const position = mapData.position;
        const numberOfHumans = mapData.numberOfHumans;
        const numberOfZombies = mapData.numberOfZombies;

        // first thing first, the background
        this.drawImage( imagesLoader.getImg('map'), -100 * (position.x % 6) - 25, -100 * (position.y % 6) - 25);

        // buildings
        neighbours.neighbours.forEach((neighbour: HMapNeighbour) => {
            if (neighbour.building !== 0 && neighbour.building !== null) {
                this.drawImage( imagesLoader.getImg('b' + neighbour.building), neighbour.offsetX, neighbour.offsetY);
            }
        });

        // night filter
        if (mapData.hour < 7 || mapData.hour > 18) {
            this.drawImage( imagesLoader.getImg('night'), -25, -25);
        }

        // humans
        this.drawImage(imagesLoader.getImg('humanGlow'), 141, 141); // you
        for (let k = 1; k <= numberOfHumans - 1; k++) { // others
            const newPosH = random.randomCircle(center, Math.floor(random.random() * 30) + 5);
            this.drawImage(imagesLoader.getImg('humanGlow'), newPosH.x, newPosH.y);
        }

        // zombies
        for (let n = 1; n <= numberOfZombies; n++) {
            const newPosZ = random.randomCircle(center, Math.floor(random.random() * 40) + 5 );
            this.drawImage(imagesLoader.getImg('zombieGlow'), newPosZ.x, newPosZ.y);
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
                        this.drawImageRot(imagesLoader.getImg('single'), offsetX - 50 + oX, offsetY - 50 + oY, 200, 200, 0);
                    }
                }
            }
        }
    }

}


