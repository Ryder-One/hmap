import { AbstractHMapLayer } from './abstract';
import { HMapDesertMap } from '../maps/desert';

export class HMapForegroundLayer extends AbstractHMapLayer {

    constructor(map: HMapDesertMap) {
        super(map);

        if (document.querySelector('#canvasFG') === null) {
            const canvas = document.createElement('canvas');
            canvas.setAttribute('id', 'canvasFG');
            canvas.setAttribute('style', 'position:absolute;z-index:2;');
            document.querySelector('#hmap')!.appendChild(canvas);
        }
        this.canvas = document.getElementById('canvasFG') as HTMLCanvasElement;

        this.canvas.width = map.width;
        this.canvas.height = map.height;
        this.canvas.style.width = map.width + 'px';
        this.canvas.style.height = map.height + 'px';

        this.ctx.imageSmoothingEnabled = true;
        this.ctx.font = '14px visitor2';
        this.type = 'foreground';
    }

    public draw() {
        this.ctx.translate(0.5, 0.5); // try to fix blurry text & stuff

        const map = this.map as HMapDesertMap;
        const mapData = this.map.mapData!;
        const imagesLoader = this.map.imagesLoader;

        // clear the scene
        this.ctx.clearRect(0, 0, map.width, map.height);

        // focus lens shadow (433x433)
        this.drawImage(imagesLoader.getImg('shadowFocus'), (map.width - 433) / 2, (map.height - 433) / 2);

        // arrow pointing toward target
        if (mapData.position.x !== map.target.x || mapData.position.y !== map.target.y) {
            const targetAngle = Math.atan2(map.target.y - mapData.position.y, map.target.x - mapData.position.x);
            this.positionTargetArrow(targetAngle);
        }

        // glass
        this.drawImage(imagesLoader.getImg('glass'), 0, 0);

        // blood
        if (!mapData.hasControl) {
            this.drawImage(imagesLoader.getImg('blood'), 0, 0);
        }

        // position text
        const relativePos = mapData.getPositionRelativeToTown(mapData.position);
        const positionText = 'position : ' + (relativePos.x) + ' / ' + (relativePos.y);
        const positionTextWidth = Math.floor(this.ctx.measureText(positionText).width + 10);
        this.ctx.fillStyle = '#d6fe5a';
        this.ctx.fillText(positionText, map.width - positionTextWidth - 2, map.height - 20);

        // arrows
        for (let i = 0, j = map.registredArrows.length; i < j; i++) {
            const arrow = map.registredArrows[i];
            this.drawImageRot(imagesLoader.getImg('moveArrowLight'), arrow.ax, arrow.ay, 82, 27, arrow.a);
            this.drawImageRot(imagesLoader.getImg('moveArrowOutline'), arrow.ax, arrow.ay, 83, 28, arrow.a);
            this.drawImageRot(imagesLoader.getImg('moveArrowOutline'), arrow.ax, arrow.ay, 83, 28, arrow.a); // increase luminosity - lazy method
            if (arrow.over) {
                this.drawImageRot(imagesLoader.getImg('moveArrowLight'), arrow.ax, arrow.ay, 82, 27, arrow.a); // increase luminosity - lazy method
                this.drawImageRot(imagesLoader.getImg('moveArrowLight'), arrow.ax, arrow.ay, 82, 27, arrow.a); // increase luminosity - lazy method
            }
        }

        // scout
        if (mapData.scoutArray && mapData.scoutArray.length === 4) {
            if (mapData.neighbours.neighbours.get('top_center')!.outbounds === false) {
                this.ctx.fillText('' + mapData.scoutArray[0], 148, 30);
            }
            if (mapData.neighbours.neighbours.get('middle_right')!.outbounds === false) {
                this.ctx.fillText('' + mapData.scoutArray[1], 270, 152);
            }
            if (mapData.neighbours.neighbours.get('bottom_center')!.outbounds === false) {
                this.ctx.fillText('' + mapData.scoutArray[2], 148, 270);
            }
            if (mapData.neighbours.neighbours.get('middle_left')!.outbounds === false) {
                this.ctx.fillText('' + mapData.scoutArray[3], 30, 152);
            }
        }
        this.ctx.translate(-0.5, -0.5); // try to fix blurry text & stuff
    }

    /**
     * Draw the small green arrow pointing toward the target
     * The angle is not calculated here
     * @param img img of the arrow
     * @param angle angle precalculated
     */
    private positionTargetArrow(angle: number) {
        let originX = this.map.width / 2 - 4;
        let originY = this.map.height / 2 - 8;
        originX += 120 * Math.cos(angle);
        originY += 120 * Math.sin(angle);

        this.drawImageRot(this.map.imagesLoader.getImg('targetArrow'), originX, originY, 9, 17, angle * 180 / Math.PI);
    }

}


