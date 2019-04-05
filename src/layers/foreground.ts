import { AbstractHMapLayer } from './abstract';
import { HMap } from '../hmap';

export class HMapForegroundLayer extends AbstractHMapLayer {

    constructor(jQ: JQueryStatic, map: HMap) {
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

        const mapData = this.map.mapData!;
        const imagesLoader = this.map.imagesLoader;

        // focus lens shadow
        this.drawImage( imagesLoader.getImg('shadowFocus'), -66, -66);

        // arrow pointing toward town
        if (mapData.position.x !== mapData.town.x || mapData.position.y !== mapData.town.y) {
            const townAngle = Math.atan2(mapData.town.y - mapData.position.y, mapData.town.x - mapData.position.x);
            this.positionTownArrow(townAngle);
        }

        // glass
        this.drawImage(imagesLoader.getImg('glass'), 0, 0);

        // blood
        if (!mapData.hasControl) {
            this.drawImage(imagesLoader.getImg('blood'), 0, 0);
        }

        this.ctx.fillStyle = '#d6fe5a';
        this.ctx.fillText('position : ' + (mapData.position.x - mapData.town.x) + ' / ' + (mapData.town.y - mapData.position.y), 190, 280);

        // arrows
        for (let i = 0, j = this.map.registredArrows.length; i < j; i++) {
            const arrow = this.map.registredArrows[i];
            this.drawImageRot(imagesLoader.getImg('moveArrowLight'), arrow.ax, arrow.ay, 82, 27, arrow.a);
            this.drawImageRot(imagesLoader.getImg('moveArrowOutline'), arrow.ax, arrow.ay, 83, 28, arrow.a);
            this.drawImageRot(imagesLoader.getImg('moveArrowOutline'), arrow.ax, arrow.ay, 83, 28, arrow.a); // increase luminosity
            if (arrow.over) {
                this.drawImageRot(imagesLoader.getImg('moveArrowLight'), arrow.ax, arrow.ay, 82, 27, arrow.a); // increase luminosity
                this.drawImageRot(imagesLoader.getImg('moveArrowLight'), arrow.ax, arrow.ay, 82, 27, arrow.a); // increase luminosity
            }
        }

        // scout
        if (mapData.scoutArray && mapData.scoutArray.length === 4) {
            this.ctx.fillText( '' + mapData.scoutArray[0], 148, 30);
            this.ctx.fillText( '' + mapData.scoutArray[1], 270, 152);
            this.ctx.fillText( '' + mapData.scoutArray[2], 148, 270);
            this.ctx.fillText( '' + mapData.scoutArray[3], 30, 152);
        }
    }

    /**
     * Draw the small green arrow pointing toward the town
     * The angle is not calculated here
     * @param img img of the arrow
     * @param angle angle precalculated
     */
    private positionTownArrow(angle: number) {
        let originX = 150 - 4;
        let originY = 150 - 8;
        originX += 120 * Math.cos(angle);
        originY += 120 * Math.sin(angle);

        this.drawImageRot(this.map.imagesLoader.getImg('townArrow'), originX, originY, 9, 17, angle * 180 / Math.PI);
    }

}


