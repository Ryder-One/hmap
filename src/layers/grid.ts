import { AbstractHMapLayer } from './abstract';
import { HMapGridMap } from '../maps/grid';

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
     * We could be more performant splitting the drawing of static objects in a separate layer
     * But I didnt see any performance issues
     */
    draw(): void {
        // this.ctx.translate(0.5, 0.5); // try to fix blurry text & stuff
        const mapData = this.map.mapData!;
        const map = this.map as HMapGridMap;
        const spaceBetweenSquares = 1;

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

                if (visionArray[i] !== undefined && visionArray[i] !== null && visionArray[i]! >= 0 ) {

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
                            this.ctx.fillStyle = 'transparent'; // too bright, waitng for the right color
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

            // square around the current position
            if ( (position.y === mapData.position.y && position.x === mapData.position.x) || map.mouseOverIndex === i) {
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
        }

        // popup should be drawn on top of everything
       if (popup) {
            this.drawPopup(xPopup!, yPopup!);
       }

        // glass
        this.drawImage(map.imagesLoader.getImg('glass'), 0, 0);
        // this.ctx.translate(-0.5, -0.5);
    }

    private drawPopup(x: number, y: number) {

        this.ctx.save();
        const map = this.map as HMapGridMap;
        const mapData = map.mapData!;
        const currentPos = mapData.getCoordinates(map.mouseOverIndex);
        const relativePos = mapData.getPositionRelativeToTown(currentPos);

        let text = '';
        if (mapData.details[map.mouseOverIndex]._c > 0 || mapData.details[map.mouseOverIndex]._c === - 1) {
            if (mapData.details[map.mouseOverIndex]._c === 1) {
                text = mapData.townName + ' ';
            } else {
                const buildingName = mapData.buildings.get(mapData.details[map.mouseOverIndex]._c);
                if (buildingName) {
                    text = buildingName + ' ';
                }
            }
        }
        text += '[ ' + relativePos.x + ' , ' + relativePos.y + ' ]';

        const yPopup = Math.max(y - 15, 0);
        const popupWidth = Math.floor(this.ctx.measureText(text).width + 10);
        const popupHeight = 15;
        const minWidthHeight = Math.min(map.width, map.height);
        const xPopup = Math.floor(Math.min( Math.max(x - popupWidth / 2, 0), minWidthHeight - popupWidth));

        this.ctx.strokeStyle = '#b9ba3e';
        this.ctx.fillStyle = '#000000';
        this.ctx.lineWidth = 1;
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.globalAlpha = 0.6;
        this.ctx.fillRect(xPopup, yPopup, popupWidth, popupHeight);
        this.ctx.globalAlpha = 1.0;
        this.ctx.strokeRect(xPopup, yPopup, popupWidth, popupHeight);
        this.ctx.imageSmoothingEnabled = true;

        this.ctx.fillStyle = '#d7ff5b';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText( text, Math.floor(xPopup + 5), Math.floor(yPopup + popupHeight / 2 - 1));
        this.ctx.restore();
    }
}
