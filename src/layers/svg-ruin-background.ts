import { AbstractHMapLayer } from './abstract';
import { HMapRuinDataJSON, HMapRuinLocalDataJSON, HMapRuinData, HMapWallNumber, HMapZoneNumber } from '../data/hmap-ruin-data';
import { HMapRuin } from '../maps/ruin';
import { HMapPoint } from '../hmap';
import { HMapRandom } from '../random';
import { HMapImagesLoader } from '../imagesLoader';

// Here are all the possible walls and zones
// I used these names to position elements accurately
//
//              D         E
//              |    Z2   |
//              |         |
//       B------|----F----|------ G
//              |         |
//         Z1   C    Z5   I   Z3
//              |         |
//       A------|----L----|------ H
//              |         |
//              |    Z4   |
//              K         J
//

interface HMapZoneCoordinates {
    topLeft: HMapPoint;
    bottomRight: HMapPoint;
}

interface HMapWallCoords extends HMapPoint {
    direction: 'top-right' | 'top' | 'top-left' | 'bottom-right' | 'bottom-left' | 'bottom' | 'left' | 'right';
}

/**
 * This layer is dedicated to the loading screen
 */
export class HMapSVGRuinBackgroundLayer extends AbstractHMapLayer<HMapRuinDataJSON, HMapRuinLocalDataJSON> {

    private translation: HMapPoint = { x: 0, y: 0 }; // translation really applied

    private availableWalls: Array<HMapWallNumber> = new Array();
    private availableZones: Array<HMapZoneNumber> = new Array();

    // variables to do the translation on arrow click
    private startTranslate?: number; // timestamp
    private translateTo: HMapPoint = { x: 0, y: 0 }; // target (translation to achieve after easing)
    private intervalEasing?: number;

    private random: HMapRandom;

    constructor(map: HMapRuin) {
        super(map);

        const hmap = document.querySelector('#hmap') as HTMLElement;
        if (document.querySelector('#svgRuinBackground') === null && hmap) {
            const SVG = document.createElementNS(this.ns, 'svg');
            SVG.setAttributeNS(null, 'id', 'svgRuinBackground');
            SVG.setAttributeNS(null, 'style', 'position:absolute;z-index:10;');
            hmap.appendChild(SVG);
            SVG.style.pointerEvents = 'none';
        }
        this.svg = document.getElementById('svgRuinBackground') as HTMLObjectElement;
        this.svg.setAttributeNS(null, 'width', map.width + 'px');
        this.svg.setAttributeNS(null, 'height', map.height + 'px');
        this.svg.style.width = map.width + 'px';
        this.svg.style.height = map.height + 'px';

        this.type = 'ruin-background';

        this.random = new HMapRandom();
    }

    draw() {
        const oldGroup = this.g;

        this.g = document.createElementNS(this.ns, 'g');

        const imagesLoader = HMapImagesLoader.getInstance();
        const map = this.map as HMapRuin;
        const mapData = this.map.mapData as HMapRuinData;
        this.random = new HMapRandom(mapData.seed);
        const typeOfRuin = mapData.ruinType;

        this.availableWalls = this.buildAvailableWalls();
        this.availableZones = this.buildAvailableZones();

        if (mapData.room === true) {
            this.imgFromObj('room', 0, 0);
        } else {
            const directions = mapData.directionsStr;

            this.imgFromObj(directions, 0, 0);

            // the main door
            if (mapData.exit) {
                this.imgFromObj('exit', 117, 90);
            }

            // position the doors
            if (mapData.door) {
                const coord = this.getRandomWallCoordinatesForDoors(30, 30, ['D', 'E', 'K', 'J']);
                if (coord) {
                    const openClosed = (mapData.door._locked) ? 'closed' : 'open';
                    const door = this.imgFromObj('door-' + coord.direction + '-' + openClosed, coord.x, coord.y);
                    door.style.cursor = 'pointer';
                    door.style.pointerEvents = 'auto';
                    door.onclick = (event: MouseEvent) => {
                        map.enterRoom();
                    };
                } else {
                    throw new Error('HMapSVGRuinBackground::draw - out of walls for doors');
                }
            }

            // zombies, we generate now and display after to ensure they are on top of everything (dont move this code under)
            const zombies = new Array<HMapPoint>();
            for (let n = 1; n <= mapData.zombies; n++) {
                const zombieObj = imagesLoader.get('zombiegif');
                const newPos = this.getRandomFloorCoordinates(
                    zombieObj.width,
                    zombieObj.height,
                    false, // false because zombies are stackable on zone
                    undefined,
                    20); // 20 = offset, to concentrate zombies around the player
                if (newPos) {
                    zombies.push(newPos);
                } else {
                    throw new Error('HMapSVGRuinBackground::draw - out of zones for zombies');
                }
            }

            // kills, we generate now and display after to ensure they are on top of everything (dont move this code under)
            const kills = new Array<HMapPoint>();
            for (let n = 1; n <= mapData.kills; n++) {
                const killsObj = imagesLoader.get('dead');
                const newPos = this.getRandomFloorCoordinates(
                    killsObj.width,
                    killsObj.height,
                    false, // false because kills are stackable on zone
                    undefined,
                    20); // 20 = offset, to concentrate kills around the player
                if (newPos) {
                    kills.push(newPos);
                } else {
                    throw new Error('HMapSVGRuinBackground::draw - out of zones for zombies');
                }
            }

            // randomize some objects on the floor
            const numberOfObjectsOnTheFloor = this.random.getOneOfLocalSeed([0, 0, 0, 0, 0, 0, 1, 2]); // change this array to change the probability
            for (let i = 0; i < numberOfObjectsOnTheFloor; i++) {
                const randomZone = this.random.getOneOfLocalSeed<HMapZoneNumber>(this.availableZones);
                if (randomZone) {
                    const imageId = this.random.getOneOfLocalSeed(mapData.zones[typeOfRuin][randomZone]);
                    if (imageId) {
                        const imageObj = imagesLoader.get(imageId);
                        const coordinates = this.getRandomFloorCoordinates(imageObj.width, imageObj.height, true, randomZone);
                        if (coordinates) {
                            this.imgFromObj(imageId, coordinates.x, coordinates.y);
                        }
                    }
                }
            }

            // randomize some objects on the walls
            const numberOfObjectsOnTheWall = this.random.getOneOfLocalSeed([5]); // change this array to change the probability
            for (let i = 0; i < numberOfObjectsOnTheWall; i++) {
                const randomWall = this.random.getOneOfLocalSeed<HMapWallNumber>(this.availableWalls);
                if (randomWall) {
                    this.availableWalls = this.removeFromArray<HMapWallNumber>(randomWall, this.availableWalls);
                    const imageId = this.random.getOneOfLocalSeed(mapData.walls[typeOfRuin][randomWall]);
                    if (imageId) {
                        const coordinates = this.getCoordinates(imageId);
                        if (coordinates) {
                            this.imgFromObj(imageId, coordinates.x, coordinates.y);
                        }
                    }
                }
            }

            zombies.forEach((coord) => { this.imgFromObj('zombiegif', coord.x, coord.y); });
            kills.forEach((coord) => { this.imgFromObj('dead', coord.x, coord.y); });

            // you
            const you = this.imgFromObj('you', 142, 136);
            you.setAttributeNS(null, 'id', 'hmap-ruin-you');
        }
        this.svg.appendChild(this.g);
        if (oldGroup) {
            window.setTimeout(() => this.svg.removeChild(oldGroup), 100);
        }
    }

    /**
     * Append the next tile before we move to avoid blank area
     */
    appendNextTile(shiftX: number, shiftY: number, dirs: Array<Boolean>) {
        const map = this.map as HMapRuin;
        const directions = '' + (+dirs[2]) + (+dirs[1]) + (+dirs[0]) + (+dirs[3]);
        this.imgFromObj(directions, shiftX * 300, shiftY * 300);
    }

    /**
     * Translate the background with an ease movement
     * @param target target of the movement
     * @param callback called once the move is done
     */
    easeMovement(target: HMapPoint, callback: CallableFunction) {

        this.startTranslate = Date.now();
        this.translateTo = target;

        if (!this.intervalEasing) {
            this.intervalEasing = window.setInterval(() => {
                // translation effect when we click on an arrow
                let coef = 1; // this will be increasing from 0 to 1
                if (this.startTranslate) {
                    const p = (Date.now() - this.startTranslate) / 300; // 300ms
                    coef = p >= 1 ? 1 : 1 - Math.pow(2, - 10 * p); // exp easing
                } else {
                    throw new Error('Cannot ease without starting the translation');
                }

                const translateX = this.translateTo.x;
                const translateY = this.translateTo.y;

                this.translation.x = translateX * coef;
                this.translation.y = translateY * coef;

                this.g.setAttributeNS(null, 'transform', 'translate(' + -1 * this.translation.x + ' ' + -1 * this.translation.y + ')');

                if (coef >= 1) { // the motion is over, reset the variables
                    this.startTranslate = undefined;
                    this.translateTo = { x: 0, y: 0 };
                    clearInterval(this.intervalEasing);
                    this.intervalEasing = undefined;
                    callback();
                    // no need to reset the translation, it will be done by the draw function
                    return;
                }
            }, 40);
        }
    }

    /**
     * I didnt manage to make it generic ...
     */
    private getCoordinates(imageId: string): HMapPoint {
        const mapData = this.map.mapData as HMapRuinData;
        const imagesLoader = HMapImagesLoader.getInstance();
        const imageObj = imagesLoader.get(imageId);
        const height = imageObj.height;
        const width = imageObj.width;

        switch (mapData.ruinType) {
            case 'bunker' :
                switch (imageId) {
                    case 'wall_hatch_A':
                        return { x: 40, y: 185 };
                    case 'wall_gutter_B':
                        return { x: 78, y: 128 - height };
                    case 'wall_hatch_B':
                        return { x: 40, y: 115 - height };
                    case 'wall_barrel_D':
                        return { x: 130 - width, y: 60 };
                    case 'wall_grid_D':
                        return { x: 114 - width, y: 55 };
                    case 'wall_pipe_D':
                        return { x: 139 - width, y: 60 };
                    case 'wall_barrel_E':
                        return { x: 170, y: 70 };
                    case 'wall_grid_E':
                        return { x: 186, y: 55 };
                    case 'wall_pipe_E':
                        return { x: 161, y: 60 };
                    case 'wall_gutter_G':
                        return { x: 222 - width, y: 128 - height };
                    case 'wall_hatch_G':
                        return { x: 260 - width, y: 115 - height };
                    case 'wall_hatch_H':
                        return { x: 260 - width, y: 185 };
                    default:
                        throw new Error('Make the compiler happy');
                }
            case 'hospital' :
                switch (imageId) {
                    case 'wall_bed_D':
                        return { x: 130 - width, y: 65 };
                    case 'wall_dead_D':
                        return { x: 130 - width, y: 70 };
                    case 'wall_bed_E':
                        return { x: 170, y: 65 };
                    case 'wall_dead_E':
                        return { x: 170, y: 70 };
                    case 'wall_grid_J':
                        return { x: 170, y: 260 - height };
                    case 'wall_grid_K':
                        return { x: 130 - width, y: 260 - height };
                    default:
                        throw new Error('Make the compiler happy');
                }
            case 'motel' :
                switch (imageId) {
                    case 'wall_bench_A':
                        return { x: 40, y: 175 };
                    case 'wall_bench_B':
                        return { x: 40, y: 125 - height };
                    case 'wall_palmtree_B':
                        return { x: 80, y: 125 - height };
                    case 'wall_flowers_D':
                        return { x: 130 - width, y: 70 };
                    case 'wall_flowers_E':
                        return { x: 170, y: 70 };
                    case 'wall_bench_G':
                        return { x: 260 - width, y: 125 - height };
                    case 'wall_palmtree_G':
                        return { x: 220 - width, y: 125 - height };
                    case 'wall_bench_H':
                        return { x: 260 - width, y: 175 };
                    default:
                        throw new Error('Make the compiler happy');
                }
        }
    }

    /**
     * Return a good random position for elements on the floor
     * There are some blinds spots but I dont think it's very important ...
     */
    private getRandomFloorCoordinates(width: number, height: number, remove = true, zone?: HMapZoneNumber, offset = 0): HMapPoint | undefined {
        let zoneCoordinates: HMapZoneCoordinates;

        if (!zone) {
            zone = this.random.getOneOfLocalSeed<HMapZoneNumber>(this.availableZones);
        }
        if (!zone) {
            return undefined;
        }
        if (remove) {
            this.availableZones = this.removeFromArray<HMapZoneNumber>(zone, this.availableZones);
        }

        if (zone === 'Z1') {
            zoneCoordinates = {
                topLeft: { x: offset, y: 115 },
                bottomRight: { x: 115 - width, y: 185 - height }
            };
        } else if (zone === 'Z2') {
            zoneCoordinates = {
                topLeft: { x: 115, y: offset },
                bottomRight: { x: 185 - width, y: 115 - height }
            };
        } else if (zone === 'Z3') {
            zoneCoordinates = {
                topLeft: { x: 185, y: 115 },
                bottomRight: { x: 300 - offset - width, y: 185 - height }
            };
        } else if (zone === 'Z4') {
            zoneCoordinates = {
                topLeft: { x: 115, y: 185 },
                bottomRight: { x: 185 - width, y: 300 - offset - height }
            };
        } else {
            zoneCoordinates = {
                topLeft: { x: 115, y: 115 },
                bottomRight: { x: 185 - width, y: 185 - height }
            };
        }

        return {
            x: this.random.getRandomIntegerLocalSeed(zoneCoordinates.topLeft.x, zoneCoordinates.bottomRight.x),
            y: this.random.getRandomIntegerLocalSeed(zoneCoordinates.topLeft.y, zoneCoordinates.bottomRight.y)
        };
    }

    /**
     * Get random coordinates on a random wall
     * This is for doors only. My method has gone smelly with all the differences ...
     * We should rewrite this code @TODO
     */
    private getRandomWallCoordinatesForDoors(
        width: number,
        height: number,
        exceptions: Array<HMapWallNumber>,
        remove = true,
        wall?: HMapWallNumber
    ): HMapWallCoords | undefined {
        if (!wall) { // we may be out of available walls (hopefully not for doors ...)
            wall = this.random.getOneOfLocalSeed<HMapWallNumber>(this.availableWalls, exceptions);
        }
        if (!wall) { // we may be out of available walls (hopefully not for doors ...)
            return undefined;
        }
        if (remove) {
            this.availableWalls = this.removeFromArray<HMapWallNumber>(wall, this.availableWalls);
        }

        switch (wall) {
            case 'A':
                return {
                    direction: 'bottom-left',
                    x: 40,
                    y: 175
                };
            case 'B':
                return {
                    direction: 'top-left',
                    x: 40,
                    y: 125 - height
                };
            case 'C':
                return {
                    direction: 'left',
                    x: 130 - width,
                    y: 150 - width - 2
                };
            case 'D':
                return {
                    direction: 'left',
                    x: 130 - width,
                    y: 90
                };
            case 'E':
                return {
                    direction: 'right',
                    x: 170,
                    y: 90
                };
            case 'F':
                return {
                    direction: 'top',
                    x: 150 - (width / 2),
                    y: 125 - height
                };
            case 'G':
                return {
                    direction: 'top-right',
                    x: 260 - width,
                    y: 125 - height
                };
            case 'H':
                return {
                    direction: 'bottom-right',
                    x: 260 - width,
                    y: 175
                };
            case 'I':
                return {
                    direction: 'right',
                    x: 170,
                    y: 150 - height / 2
                };
            case 'J':
                return {
                    direction: 'bottom',
                    x: 170,
                    y: 260 - height
                };
            case 'K':
                return {
                    direction: 'bottom',
                    x: 130 - width,
                    y: 260 - height
                };
            case 'L':
                return {
                    direction: 'bottom',
                    x: 150 - width / 2,
                    y: 175
                };
        }
    }

    /**
     * Get the available walls to put elements (doors or furnitures) on it
     */
    private buildAvailableWalls(): Array<HMapWallNumber> {
        const mapData = this.map.mapData as HMapRuinData;
        const directions = mapData.directions;
        const walls = new Array();
        if (directions[2] === true) {
            walls.push('A');
            walls.push('B');
        } else {
            walls.push('C');
        }
        if (directions[1] === true) {
            walls.push('D');
            walls.push('E');
        } else {
            walls.push('F');
        }
        if (directions[0] === true) {
            walls.push('G');
            walls.push('H');
        } else {
            walls.push('I');
        }
        if (directions[3] === true) {
            walls.push('J');
            walls.push('K');
        } else {
            walls.push('L');
        }
        return walls;
    }

    /**
     * Get the available zones to put objects on the floor
     */
    private buildAvailableZones(): Array<HMapZoneNumber> {
        const mapData = this.map.mapData as HMapRuinData;
        const directions = mapData.directions;
        const zones = new Array();
        zones.push('Z5');
        if (directions[2] === true) {
            zones.push('Z1');
        }
        if (directions[1] === true) {
            zones.push('Z2');
        }
        if (directions[0] === true) {
            zones.push('Z3');
        }
        if (directions[3] === true) {
            zones.push('Z4');
        }
        return zones;
    }

    private removeFromArray<T>(element: T, _array: Array<T>): Array<T> {
        const index = _array.indexOf(element);
        if (index !== -1) {
            _array.splice(index, 1);
        }
        return _array;
    }
}
