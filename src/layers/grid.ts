import { AbstractHMapLayer } from './abstract';
import { HMapGridMap } from '../maps/grid';
import { HMapRandom } from '../random';

/**
 * This layer will hold the grid view
 */
export class HMapGridLayer extends AbstractHMapLayer {

    constructor(map: HMapGridMap) {
        super(map);

        if (document.querySelector('#canvasGrid') === null && document.querySelector('#hmap') !== null) {
            const canvas = document.createElement('canvas');
            canvas.setAttribute('id', 'canvasGrid');
            canvas.setAttribute('style', 'position:absolute;z-index:2;');
            document.querySelector('#hmap')!.appendChild(canvas);
        }
        this.canvas = document.getElementById('canvasGrid') as HTMLCanvasElement;
        this.canvas.width = map.width;
        this.canvas.height = map.height;
        this.canvas.style.width = map.width + 'px';
        this.canvas.style.height = map.height + 'px';

        this.ctx.imageSmoothingEnabled = true;
        this.ctx.font = '14px visitor2';
        this.type = 'grid';
    }

    /**
     * We could be more efficient by drawing only the changes
     * But I didnt see any performance issues
     * Still @TODO
     */
    draw(): void {
        const mapData = this.map.mapData!;
        const map = this.map as HMapGridMap;
        const spaceBetweenSquares = 1;

        this.ctx.clearRect(0, 0, map.width, map.height);
        map.popup = undefined;

        const minWidthHeight = Math.min(map.width, map.height);

        const availableSize = minWidthHeight - 25 - spaceBetweenSquares * mapData.size.height;
        const squareSize = Math.floor(availableSize / mapData.size.height);
        const padding = Math.floor((minWidthHeight - spaceBetweenSquares * mapData.size.height - squareSize * mapData.size.height) / 2);

        this.ctx.fillStyle = '#2b3a08';
        this.ctx.fillRect(0, 0, map.width, map.height);

        let popup = false;
        let xPopup: number, yPopup: number;

        for (let i = 0, j = mapData.details.length; i < j; i++) {
            const position = mapData.getCoordinates(i);

            const x = padding + position.x * (squareSize + spaceBetweenSquares);
            const y = padding / 2 + position.y * (squareSize + spaceBetweenSquares);

            if (map.mouse
                && map.mouse.x > x
                && map.mouse.x < (x + squareSize)
                && map.mouse.y > y
                && map.mouse.y < (y + squareSize)) {

                map.mouseOverIndex = i;
            }

            if (mapData.details[i]._c === 1) { // town
                this.drawImage(map.imagesLoader.getImg('town'), x, y, squareSize, squareSize);
            } else {

                // color or hatch the position
                let visionArray = mapData.global;
                if (map.mode === 'personal') {
                    visionArray = mapData.view;
                }

                if (visionArray[i] !== undefined && visionArray[i] !== null && visionArray[i]! >= -1 ) {

                    if (mapData.details[i]._nvt === true) { // outside of tower range
                        this.drawImage(map.imagesLoader.getImg('hatch'), x, y, squareSize, squareSize);
                    } else if (mapData.details[i]._nvt === false) { // inside of tower range
                        if (mapData.details[i]._z > 9) {
                            this.ctx.fillStyle = '#8f340b';
                        } else if (mapData.details[i]._z > 5) {
                            this.ctx.fillStyle = '#8f7324';
                        } else if (mapData.details[i]._z > 0) {
                            this.ctx.fillStyle = '#8f990b';
                        } else {
                            this.ctx.fillStyle = 'transparent'; // not as the original
                        }

                        this.ctx.fillRect(x, y, squareSize, squareSize);

                    } else {
                        throw new Error('HMapGridLayer::draw - as far as I understand, we cannot be in this case');
                    }

                } else { // position never visited
                    this.drawImage(map.imagesLoader.getImg('hatch-dense'), x, y, squareSize, squareSize);
                }

                if (mapData.details[i]._c > 0 || mapData.details[i]._c === -1) { // another building than town
                    this.drawImage(map.imagesLoader.getImg('building'), x, y, squareSize, squareSize);
                }
            }

            // place the users
            if (mapData.details[i]._c !== 1 ) {
                const users = mapData.users.get(i);
                if (users !== undefined) {

                    users.forEach(user => {
                        let usernameAsNumber = 0; // for seeding purposes
                        for (let k = 0; k < user._n.length; k++) {
                            usernameAsNumber += user._n.charCodeAt(k);
                        }
                        const seed = (x * 10 + y) * ( y * 10 + x) + usernameAsNumber;
                        const random = new HMapRandom(seed);

                        this.drawImage(
                            map.imagesLoader.getImg('people'),
                            x + random.getRandomIntegerLocalSeed(0.2 * squareSize, 0.8 * squareSize),
                            y + random.getRandomIntegerLocalSeed(0.2 * squareSize, 0.8 * squareSize)
                        );
                    });
                }
            }

            // square around the current position
            if ( (position.y === mapData.position.y && position.x === mapData.position.x) || map.mouseOverIndex === i) { // current pos
                this.drawImage(map.imagesLoader.getImg('position'), x, y, squareSize, squareSize);
            } else if ( mapData.details[i]._c !== 1 &&
                        position.x === map.target.x &&
                        position.y === map.target.y) { // not town && target
                this.drawImage(map.imagesLoader.getImg('target'), x, y, squareSize, squareSize);
            }

            if (map.mouseOverIndex === i) {
                popup = true;
                xPopup = x;
                yPopup = y;
            }
        } // iterate over cases

        // set the popup to draw it
        if (popup) {
            map.popup = {x: xPopup!, y: yPopup!};
        }

        // glass
        this.drawImage(map.imagesLoader.getImg('glass'), 0, 0);
    }
}
