import { AbstractHMapLayer } from './abstract';
import { HMapDesertMap } from '../maps/desert';

export class HMapBufferLayer extends AbstractHMapLayer {

    constructor(map: HMapDesertMap) {
        super(map);

        this.canvas = document.createElement('canvas');
        this.canvas.width = 300;
        this.canvas.height = 300;
        this.ctx.imageSmoothingEnabled = false;

        this.type = 'buffer';
    }

    public draw() {

    }

}


