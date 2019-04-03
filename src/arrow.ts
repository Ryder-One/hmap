export type HMapArrowDirection = 'left' | 'right' | 'top' | 'bottom';

export class HMapArrow {
    public ax: number; // x position of the pic
    public ay: number; // y position of the pic
    public rx: number; // x position of the rect around the pic
    public ry: number; // y position of the rect around the pic
    public w: number;
    public h: number;
    public t: HMapArrowDirection;
    public a: number; // angle
    public over: boolean; // is the arrow currently rolled over

    constructor(ax: number, ay: number, rx: number, ry: number, w: number, h: number, t: HMapArrowDirection, a: number , over = false) {
        this.ax = ax;
        this.ay = ay;
        this.rx = rx;
        this.ry = ry;
        this.w = w;
        this.h = h;
        this.t = t;
        this.a = a;
        this.over = over;

    }
}
