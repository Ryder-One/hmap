import { HMapRandom } from '../random';
import { AbstractHMapLayer } from './abstract';
import { HMapGridMap } from '../maps/grid';

/**
 * This layer will hold the grid view
 */
export class HMapSVGGridLayer extends AbstractHMapLayer {

    private spaceBetweenSquares = 1;
    private squareSize?: number;
    private padding?: number;

    private isPanning = false;
    private startPoint = {x: 0 , y: 0};
    private endPoint = {x: 0, y: 0};
    private scale = 1;
    private viewBox = {x : 0, y : 0, w : 0, h : 0};

    constructor(map: HMapGridMap) {
        super(map);

        const hmap = document.querySelector('#hmap') as HTMLElement;
        if (document.querySelector('#svgGrid') === null && hmap) {
            const SVG = document.createElementNS(this.ns, 'svg');
            SVG.setAttributeNS(null, 'id', 'svgGrid');
            SVG.setAttributeNS(null, 'style', 'position:absolute;z-index:2;');
            hmap.appendChild(SVG);
            hmap.style.backgroundColor = '#2b3a08';
        }
        this.svg = document.getElementById('svgGrid') as HTMLObjectElement;
        this.svg.setAttributeNS(null, 'width', map.width  + 'px');
        this.svg.setAttributeNS(null, 'height', map.height  + 'px');
        this.svg.style.width = map.width + 'px';
        this.svg.style.height = map.height + 'px';

        this.attachPanZoomEvents();

        this.type = 'grid';
    }

    draw() {
        const oldGroup = this.g;
        this.g = document.createElementNS(this.ns, 'g');

        const mapData = this.map.mapData!;
        const map = this.map as HMapGridMap;
        const minWidthHeight = Math.min(map.width, map.height);
        const availableSize = minWidthHeight - 25 - this.spaceBetweenSquares * mapData.size.height;
        this.squareSize = Math.floor(availableSize / mapData.size.height);
        this.padding = Math.floor((minWidthHeight - this.spaceBetweenSquares * mapData.size.height - this.squareSize * mapData.size.height) / 2);

        for (let i = 0, j = mapData.details.length; i < j; i++) {
            const position = mapData.getCoordinates(i);
            const currentPos = (position.y === mapData.position.y && position.x === mapData.position.x); // position is current positon

            const x = this.padding + position.x * (this.squareSize + this.spaceBetweenSquares);
            const y = this.padding / 2 + position.y * (this.squareSize + this.spaceBetweenSquares);

            // color or hatch the position
            let visionArray = mapData.global;
            if (map.mode === 'personal') {
                visionArray = mapData.view;
            }

            // color the case
            let fillColor = '#475613'; // default background color
            let strokeColor;
            if ( currentPos ) {
                strokeColor = '#d8fe6e';
            }
            if (mapData.details[i]._z > 9) {
                fillColor = '#8f340b';
            } else if (mapData.details[i]._z > 5) {
                fillColor = '#8f7324';
            } else if (mapData.details[i]._z > 0) {
                fillColor = '#8f990b';
            } else {
                fillColor = '#475613';
            }
            const square = this.rect(x, y, this.squareSize, this.squareSize, fillColor, strokeColor);
            square.setAttributeNS(null, 'index', i + '');
            if (currentPos) {
                square.setAttributeNS(null, 'current', 'true');
            }

            square.onmouseenter = this.onMouseEnterSquare.bind(this);
            square.onmouseleave = this.onMouseLeaveSquare.bind(this);
            square.onmouseup = this.onMouseUpSquare.bind(this);

            if (visionArray[i] !== undefined && visionArray[i] !== null && visionArray[i]! >= -1 ) {

                if (mapData.details[i]._nvt === true) { // outside of tower range
                    this.img(map.imagesLoader.get('hatch').src, x, y, this.squareSize, this.squareSize);
                } else if (mapData.details[i]._nvt === false) { // inside of tower range
                    // apparently nothing to do in this case, but I'm not sure so I let the if
                } else {
                    throw new Error('HMapGridLayer::draw - as far as I understand, we cannot be in this case');
                }

            } else { // position never visited
                this.img(map.imagesLoader.get('hatch-dense').src, x, y, this.squareSize, this.squareSize);
            }

            if (mapData.details[i]._c > 0 || mapData.details[i]._c === -1) { // another building than town
                if (mapData.details[i]._c === 1) { // town
                    this.img(map.imagesLoader.get('town').src, x, y, this.squareSize, this.squareSize);
                } else {
                    this.img(map.imagesLoader.get('building').src, x, y, this.squareSize, this.squareSize);
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

                        const userImg = this.img(
                            map.imagesLoader.get('people').src,
                            x + random.getRandomIntegerLocalSeed(0.2 * this.squareSize!, 0.8 * this.squareSize!),
                            y + random.getRandomIntegerLocalSeed(0.2 * this.squareSize!, 0.8 * this.squareSize!),
                            5,
                            5
                        );
                        userImg.setAttributeNS(null, 'class', 'hmap-user');
                    });
                }
            }

            // display tags
            if (map.displayTags) {
                const tag = mapData.details[i]._t;
                if ( tag > 0 && tag < 13) {
                    const tagSize = Math.min(this.squareSize / 1.5, 16);

                    const tagImg = this.img(
                        map.imagesLoader.get('tag_' + tag).src,
                        x + this.squareSize / 2 - tagSize / 2,
                        y + this.squareSize / 2 - tagSize / 2,
                        tagSize,
                        tagSize);
                    tagImg.setAttributeNS(null, 'class', 'hmap-tag');
                }
            }

            // draw the target
            if ( mapData.details[i]._c !== 1 &&
                        !currentPos &&
                        position.x === map.target.x &&
                        position.y === map.target.y) { // not town && target && not current pos
                const target = this.img(map.imagesLoader.get('target').src, x, y, this.squareSize, this.squareSize);
                target.setAttributeNS(null, 'class', 'hmap-target');
            }
        } // iterate over the grid

        this.svg.appendChild(this.g);
        if (oldGroup) {
            window.setTimeout(() => this.svg.removeChild(oldGroup), 100);
        }
    }

    private onMouseEnterSquare(e: MouseEvent) {
        if (this.isPanning) {
            return;
        }
        const rect = e.target as HTMLObjectElement;
        const index = (rect.getAttributeNS(null, 'index') !== null) ? +rect.getAttributeNS(null, 'index')! : undefined ;
        if (index !== undefined && this.squareSize && this.padding) {
            const mapData = this.map.mapData!;
            const position = mapData.getCoordinates(index);
            const x = this.padding + position.x * (this.squareSize + this.spaceBetweenSquares);
            const y = this.padding / 2 + position.y * (this.squareSize + this.spaceBetweenSquares);

            if (rect.getAttributeNS(null, 'current') !== 'true') {
                rect.setAttributeNS(null, 'stroke', '#d8fe6e');
                rect.setAttributeNS(null, 'stroke-width', '2');
            }
            this.drawPopup(x, y, index);
        }
    }

    private onMouseLeaveSquare(e: MouseEvent) {
        if (this.isPanning) {
            return;
        }
        const rect = e.target as HTMLObjectElement;
        if (rect.getAttributeNS(null, 'current') !== 'true') {
            rect.setAttributeNS(null, 'stroke', '');
            rect.setAttributeNS(null, 'stroke-width', '0');
        }
        // remove the popup elements
        document.querySelectorAll('.hmap-popup').forEach(elementToRemove => elementToRemove.remove() );
    }

    private onMouseUpSquare(e: MouseEvent) {
        if (this.startPoint.x !== this.endPoint.x || this.startPoint.y !== this.endPoint.y) {
            return; // panning situation. leave
        }

        const map = this.map as HMapGridMap;
        const rect = e.target as HTMLObjectElement;
        const index = (rect.getAttributeNS(null, 'index') !== null) ? +rect.getAttributeNS(null, 'index')! : undefined ;

        // remove the current target
        document.querySelectorAll('.hmap-target').forEach(elementToRemove => elementToRemove.remove() );

        // create new target
        if (index !== undefined && this.squareSize && this.padding) {
            const mapData = this.map.mapData!;
            const position = mapData.getCoordinates(index);
            const x = this.padding + position.x * (this.squareSize + this.spaceBetweenSquares);
            const y = this.padding / 2 + position.y * (this.squareSize + this.spaceBetweenSquares);

            map.setTarget(this.map.mapData!.getCoordinates(index));
            const target = this.img(map.imagesLoader.get('target').src, x, y, this.squareSize, this.squareSize);
            target.setAttributeNS(null, 'class', 'hmap-target');
        }
    }

    /**
     * Reset the zoom & pan level
     */
    resetView() {
        const width = this.map.width;
        const height = this.map.height;
        this.viewBox = {x : 0, y : 0, w : width, h : height};
        this.isPanning = false;
        this.startPoint = {x: 0 , y: 0};
        this.endPoint = {x: 0, y: 0};
        this.scale = 1;
        this.svg.setAttributeNS(null, 'viewBox', `${this.viewBox.x} ${this.viewBox.y} ${this.viewBox.w} ${this.viewBox.h}`);

    }

    /**
     * Enable the zoom and pan behavior
     */
    private attachPanZoomEvents() {
        const svgContainer = document.querySelector('#hmap')! as HTMLElement;

        this.viewBox = {x : 0, y : 0, w : this.map.width, h : this.map.height};
        this.svg.setAttributeNS(null, 'viewBox', `${this.viewBox.x} ${this.viewBox.y} ${this.viewBox.w} ${this.viewBox.h}`);
        this.isPanning = false;
        this.startPoint = {x: 0 , y: 0};
        this.endPoint = {x: 0, y: 0};
        this.scale = 1;

        svgContainer.onwheel = (e: WheelEvent) => {
            e.preventDefault();
            const w = this.viewBox.w;
            const h = this.viewBox.h;
            const rect = this.svg.getBoundingClientRect();
            const mx = e.clientX - rect.left;
            const my = e.clientY - rect.top;
            const dh = -1 * (w * Math.sign(e.deltaY) * 0.1);
            const dw = -1 * (h * Math.sign(e.deltaY) * 0.1);
            const dx = dw * mx / this.map.width;
            const dy = dh * my / this.map.height;

            this.viewBox = {x: this.viewBox.x + dx, y: this.viewBox.y + dy, w: this.viewBox.w - dw, h: this.viewBox.h - dh};
            this.scale = this.map.width / this.viewBox.w;

            this.svg.setAttributeNS(null, 'viewBox', `${this.viewBox.x} ${this.viewBox.y} ${this.viewBox.w} ${this.viewBox.h}`);
        };

        svgContainer.onmousedown = (e: MouseEvent) => {
            this.isPanning = true;
            this.startPoint = { x: e.x , y: e.y };
            this.endPoint = { x: e.x , y: e.y };
        };

        svgContainer.onmousemove = (e: MouseEvent) => {
            if (this.isPanning) {
                this.endPoint = { x: e.x, y: e.y };
                const dx = (this.startPoint.x - this.endPoint.x) / this.scale;
                const dy = (this.startPoint.y - this.endPoint.y) / this.scale;
                const movedViewBox = { x: this.viewBox.x + dx, y: this.viewBox.y + dy, w: this.viewBox.w, h: this.viewBox.h };
                this.svg.setAttributeNS(null, 'viewBox', `${movedViewBox.x} ${movedViewBox.y} ${movedViewBox.w} ${movedViewBox.h}`);
           }
        };

        svgContainer.onmouseup = (e: MouseEvent) => {
            if (this.isPanning) {
                this.endPoint = { x: e.x , y: e.y };
                const dx = (this.startPoint.x - this.endPoint.x) / this.scale;
                const dy = (this.startPoint.y - this.endPoint.y) / this.scale;
                if (dx !== 0 || dy !== 0) {
                    this.viewBox = { x: this.viewBox.x + dx, y: this.viewBox.y + dy, w: this.viewBox.w, h: this.viewBox.h };
                    this.svg.setAttributeNS(null, 'viewBox', `${this.viewBox.x} ${this.viewBox.y} ${this.viewBox.w} ${this.viewBox.h}`);
                }
                this.isPanning = false;
            }
        };

        svgContainer.onmouseleave = svgContainer.onmouseup;
    }

    private drawPopup(x: number, y: number, index: number) {

        // create a canvas to measure text, because SVG sucks at it
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        ctx.font = '13px visitor2';

        const map = this.map as HMapGridMap;
        const mapData = map.mapData!;
        const currentPos = mapData.getCoordinates(index);
        const relativePos = mapData.getPositionRelativeToTown(currentPos);

        // "Title" of the popup : building name & position
        let title = 'Desert ';
        let maxTextWidth = 0;
        if (mapData.details[index]._c > 0 || mapData.details[index]._c === - 1) {
            if (mapData.details[index]._c === 1) {
                title = mapData.townName + ' ';
            } else {
                const buildingName = mapData.buildings.get(mapData.details[index]._c);
                if (buildingName) {
                    title = buildingName + ' ';
                }
            }
        }
        title += '[ ' + relativePos.x + ' , ' + relativePos.y + ' ]';
        maxTextWidth = ctx.measureText(title).width;

        // build arrays with user name inside (each entry is a line of 3 users)
        const users = mapData.users.get(index);
        const usernamesAllLines: Array<string> = new Array();
        if (users !== undefined && mapData.details[index]._c !== 1) {
            let singleLine: Array<string> = new Array();
            for (let u = 0; u < users.length; u++) {
                const user = users[u];
                singleLine.push(user._n);
                if (u > 0 && (u + 1) % 3 === 0) { // % 3 = 3 users per line
                    const singleLineStr = singleLine.join(', ');
                    maxTextWidth = Math.max(ctx.measureText(singleLineStr).width, maxTextWidth);
                    usernamesAllLines.push(singleLineStr);
                    singleLine = new Array();
                }
            }
            if (singleLine.length > 0) { // last line
                const singleLineStr = singleLine.join(', ');
                maxTextWidth = Math.max(ctx.measureText(singleLineStr).width, maxTextWidth);
                usernamesAllLines.push(singleLineStr);
            }
        }

        // start the drawing of the popup itself
        const popupWidth = Math.floor(maxTextWidth + 10);
        const popupHeight = 15 + 15 * usernamesAllLines.length;
        const minWidthHeight = Math.min(map.width, map.height);
        const xPopup = Math.floor(Math.min( Math.max(x - popupWidth / 2, 0), minWidthHeight - popupWidth));
        const yPopup = Math.max(y - popupHeight, 0) | 0;

        // draw the rect
        const popup: SVGRectElement = this.rect(xPopup, yPopup, popupWidth, popupHeight, '#000000', '#b9ba3e', 1);
        popup.setAttributeNS(null, 'fill-opacity', '0.6');
        popup.setAttributeNS(null, 'class', 'hmap-popup');
        popup.style.pointerEvents = 'none';

        // draw the title
        const titleSize = ctx.measureText(title).width;
        this.text(
            xPopup + popupWidth / 2 - titleSize / 2,
            yPopup + 7.5,
            title,
            'hmap-text-green hmap-popup');

        // draw the usernames
        usernamesAllLines.forEach((lineToWrite, _index) => {
            const lineSize = ctx.measureText(lineToWrite).width;

            const line = this.text(
                xPopup + popupWidth / 2 - lineSize / 2,
                yPopup + 7.5 + (_index + 1 ) * 15,
                lineToWrite,
                'hmap-text-yellow hmap-popup'
            );
            line.style.fill = '#fefe00'; // overwrite the color
        });

        document.querySelectorAll('.hmap-popup').forEach((element) => {
            (element as HTMLElement).style.zIndex = '11';
        });
    }
}
