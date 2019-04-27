import { AbstractHMapLayer } from './abstract';
import { HMapGridMap } from '../maps/grid';
import { HMapPoint } from '../hmap';

/**
 * This is an HiDPI canvas. Everything get multiplicated by a coef to be in a better definition
 * This is done for the text
 */
export class HMapGridPopupLayer extends AbstractHMapLayer {

    private coef = 10; // the bigger it is, the clearer it gets; but the heavier it becomes
    private lastPopupPosition?: HMapPoint; // avoid to draw the popup each cycle

    constructor(map: HMapGridMap) {
        super(map);

        if (document.querySelector('#canvasPopupGrid') === null && document.querySelector('#hmap') !== null) {
            const canvas = document.createElement('canvas');
            canvas.setAttribute('id', 'canvasPopupGrid');
            canvas.setAttribute('style', 'position:absolute;z-index:3;pointer-events:none;');
            document.querySelector('#hmap')!.appendChild(canvas);
        }
        this.canvas = document.getElementById('canvasPopupGrid') as HTMLCanvasElement;
        this.canvas.width = map.width * this.coef;
        this.canvas.height = map.height * this.coef;
        this.canvas.style.width = map.width + 'px';
        this.canvas.style.height = map.height + 'px';

        this.ctx.imageSmoothingEnabled = false;
        this.type = 'grid-popup';
    }

    draw(): void {
        const map = this.map as HMapGridMap;

        if (map.popup !== undefined) {
            if (this.lastPopupPosition === undefined ||
                this.lastPopupPosition.x !== map.popup.x ||
                this.lastPopupPosition.y !== map.popup.y
                ) {
                this.drawPopup(map.popup.x * this.coef, map.popup.y * this.coef);
                this.lastPopupPosition = map.popup;
            }
        } else {
            this.ctx.clearRect(0, 0, map.width * this.coef, map.height * this.coef);
        }
    }

    /**
     * Draw the popup itself
     * @param x x coordinate of the popup (not grid coordinate)
     * @param y y coordinate of the popup (not grid coordinate)
     */
    private drawPopup(x: number, y: number) {

        this.ctx.save(); // we will do some changes, so save it to restore it at the end of this function
        const map = this.map as HMapGridMap;
        const mapData = map.mapData!;
        const currentPos = mapData.getCoordinates(map.mouseOverIndex);
        const relativePos = mapData.getPositionRelativeToTown(currentPos);

        this.ctx.clearRect(0, 0, map.width * this.coef, map.height * this.coef); // clear the canvas before drawing the popup

        // "Title" of the popup : building name & position
        let title = '';
        this.ctx.font = 13 * this.coef + 'px visitor2';
        let maxTextWidth = 0;
        if (mapData.details[map.mouseOverIndex]._c > 0 || mapData.details[map.mouseOverIndex]._c === - 1) {
            if (mapData.details[map.mouseOverIndex]._c === 1) {
                title = mapData.townName + ' ';
            } else {
                const buildingName = mapData.buildings.get(mapData.details[map.mouseOverIndex]._c);
                if (buildingName) {
                    title = buildingName + ' ';
                }
            }
        }
        title += '[ ' + relativePos.x + ' , ' + relativePos.y + ' ]';
        maxTextWidth = this.ctx.measureText(title).width;

        // build arrays with user name inside (each entry is a line of 3 users)
        const users = mapData.users.get(map.mouseOverIndex);
        const usernamesAllLines: Array<string> = new Array();
        if (users !== undefined && mapData.details[map.mouseOverIndex]._c !== 1) {
            let singleLine: Array<string> = new Array();
            for (let u = 0; u < users.length; u++) {
                const user = users[u];
                singleLine.push(user._n);
                if (u > 0 && (u + 1) % 3 === 0) { // % 3 = 3 users per line
                    const singleLineStr = singleLine.join(', ');
                    maxTextWidth = Math.max(this.ctx.measureText(singleLineStr).width, maxTextWidth);
                    usernamesAllLines.push(singleLineStr);
                    singleLine = new Array();
                }
            }
            if (singleLine.length > 0) { // last line
                const singleLineStr = singleLine.join(', ');
                maxTextWidth = Math.max(this.ctx.measureText(singleLineStr).width, maxTextWidth);
                usernamesAllLines.push(singleLineStr);
            }
        }

        // start the drawing of the popup itself
        const popupWidth = Math.floor(maxTextWidth + 10 * this.coef);
        const popupHeight = 15 * this.coef + 15 * this.coef * usernamesAllLines.length;
        const minWidthHeight = Math.min(map.width * this.coef, map.height * this.coef);
        const xPopup = Math.floor(Math.min( Math.max(x - popupWidth / 2, 0), minWidthHeight - popupWidth));
        const yPopup = Math.max(y - popupHeight, 0);

        this.ctx.strokeStyle = '#b9ba3e';
        this.ctx.fillStyle = '#000000';
        this.ctx.lineWidth = 1 * this.coef;
        this.ctx.globalAlpha = 0.6;
        this.ctx.fillRect(xPopup, yPopup, popupWidth, popupHeight);
        this.ctx.globalAlpha = 1.0;
        this.ctx.strokeRect(xPopup, yPopup, popupWidth | 0 + 0.5, popupHeight | 0 + 0.5);

        this.ctx.fillStyle = '#d7ff5b';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(
                title,
                Math.floor(xPopup + 5 * this.coef) + 0.5, // 0.5 subpixel thing. Does not change anything in my opinion
                Math.floor(yPopup + 6.5 * this.coef) + 0.5);

        this.ctx.fillStyle = '#fefe00';
        usernamesAllLines.forEach((lineToWrite, index) => {
            this.ctx.fillText(
                lineToWrite,
                Math.floor(xPopup + 5 * this.coef) + 0.5,
                Math.floor(yPopup + 6.5 * this.coef) + (index + 1 ) * 15 * this.coef + 0.5
            );
        });

        this.ctx.restore();
    }
}
