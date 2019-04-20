import { AbstractHMapLayer } from './abstract';
import { HMapDesertMap } from '../maps/desert';

export class HMapForegroundLayer extends AbstractHMapLayer {

    constructor(jQ: JQueryStatic, map: HMapDesertMap) {
        super(jQ, map);

        if (!this.jQ('#canvasArrows').length) {
            this.jQ('#hmap')
                .append('<canvas id="canvasArrows" width="300px" height="300px" style="position:absolute;z-index:2;"></canvas>');
        }
        this.canvas = document.getElementById('canvasArrows') as HTMLCanvasElement;
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.font = '14px visitor2';
        this.type = 'foreground';
    }

    public draw() {
        this.ctx.clearRect(0, 0, 300, 300);

        const map = this.map as HMapDesertMap;

        const mapData = this.map.mapData!;
        const imagesLoader = this.map.imagesLoader;

        // focus lens shadow
        this.drawImage(imagesLoader.getImg('shadowFocus'), -66, -66);

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
        this.ctx.fillStyle = '#d6fe5a';
        this.ctx.fillText('position : ' + (relativePos.x) + ' / ' + (relativePos.y), 190, 280);

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
    }

    /**
     * Draw the small green arrow pointing toward the target
     * The angle is not calculated here
     * @param img img of the arrow
     * @param angle angle precalculated
     */
    private positionTargetArrow(angle: number) {
        let originX = 150 - 4;
        let originY = 150 - 8;
        originX += 120 * Math.cos(angle);
        originY += 120 * Math.sin(angle);

        this.drawImageRot(this.map.imagesLoader.getImg('targetArrow'), originX, originY, 9, 17, angle * 180 / Math.PI);
    }

}


