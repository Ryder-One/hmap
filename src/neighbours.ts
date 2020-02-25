export type HMapPosition = 'top_left'|'top_center'|'top_right'|'middle_left'|'middle_center'|'middle_right'|'bottom_left'|'bottom_center'|
'bottom_right';

export class HMapNeighbour {

    public x: number;
    public y: number;
    public position: HMapPosition;
    public outbounds: boolean; // neigbhour outside of the map
    public index: number;
    public view: boolean; // is this square already visited
    public building?: number; // id of the building
    public offsetX = 0; // top left X coordinate
    public offsetY = 0; // top left Y coordinate

    constructor(x: number, y: number, p: HMapPosition, o: boolean, i: number, view: boolean, b?: number) {
        this.x = x;
        this.y = y;
        this.position = p;
        this.outbounds = o;
        this.index = i;
        this.view = view;
        this.building = b;

        if (this.position === 'top_right' || this.position === 'middle_right' || this.position === 'bottom_right') {
            this.offsetX = 200;
        } else if (this.position === 'top_center' || this.position === 'middle_center' || this.position === 'bottom_center') {
            this.offsetX = 100;
        }

        if (this.position === 'bottom_right' || this.position === 'bottom_center' || this.position === 'bottom_left') {
            this.offsetY = 200;
        } else if (this.position === 'middle_right' || this.position === 'middle_center' || this.position === 'middle_left') {
            this.offsetY = 100;
        }
    }
}

export class HMapNeighbours {
    public neighbours: Map<HMapPosition, HMapNeighbour> = new Map();

    addNeighbour(n: HMapNeighbour) {
        this.neighbours.set(n.position, n);
    }
}
