import * as calculator from 'point-calculation'

export class Point {

    public x: number;
    public y: number;
    public z: number;

    constructor(coordinates: number[]) {
        this.x = coordinates[0];
        this.y = coordinates[1];
        this.z = coordinates[2] ? coordinates[2] : 0;
    }

    public angle(anotherPoint: Point): number {
        return calculator.angle(this, anotherPoint);
    }
}
