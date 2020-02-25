import { HMapPoint } from './hmap';

export class HMapRandom {
    public seed: number;

    constructor(seed = 0) {
        this.seed = seed;
    }

    /**
     * Get a random integer between min and max
     * @warning Not using the seed.
     */
    static getRandomIntegerNoSeed(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min)) + min;
    }


    /**
     * Return one of random the element in array
     * @warning NOT using the local seed
     */
    static getOneOfNoSeed<T>(elements: Array<T>): T {
        return elements[Math.floor(Math.random() * elements.length)];
    }

    /**
    * Very simple random generator based on a fixed seed
    * @see https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript/47593316#47593316
    */
    random() {
        /*
        const x = Math.sin(this.seed++) * 10000;
        return x - Math.floor(x);
        */
        this.seed = (this.seed * 9301 + 49297) % 233280;
        return this.seed / 233280;
    }

    /**
     * Get a random integer between min and max
     * Using the local seed
     */
    getRandomIntegerLocalSeed(min: number, max: number): number {
        return Math.floor(this.random() * (max - min)) + min;
    }

    /**
     * Return one of random the element in array
     * We can pass an array of exceptions : the function will never return them
     * Using the local seed
     */
    getOneOfLocalSeed<T>(elements: Array<T>, exceptions?: Array<T>): T {
        const random = this.random();
        const element = elements[Math.floor(random * elements.length)];
        if (exceptions !== undefined && exceptions.length > 0 && exceptions.indexOf(element) !== -1) {
            return this.getOneOfLocalSeed(elements, exceptions);
        } else {
            return element;
        }
    }

    /**
     * Get a random position inside a circle
     * @param center coordinates x, y of the center
     * @param radius radius of the circle
     */
    randomCircle(center: HMapPoint, radius: number): HMapPoint {
        const ang = this.random() * 360;
        return {
            x: center.x + radius * Math.sin(ang * Math.PI / 180),
            y: center.y + radius * Math.cos(ang * Math.PI / 180)
        };
    }


}
