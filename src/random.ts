import { HMapPoint } from './hmap';

export class HMapRandom {
    public seed: number;

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


    constructor(seed = 0) {
        this.seed = seed;
    }

    /**
    * Very simple random generator based on a fixed seed
    * @see https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript/47593316#47593316
    */
    random() {
        const x = Math.sin(this.seed++) * 10000;
        return x - Math.floor(x);
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
     * Using the local seed
     */
    getOneOfLocalSeed<T>(elements: Array<T>): T {
        return elements[Math.floor(this.random() * elements.length)];
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
