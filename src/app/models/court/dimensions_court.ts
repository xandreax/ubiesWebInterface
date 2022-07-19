import {Point} from "../cartesian/point.model";

export class AnchorsPositions {

    // Court axis
    // 10 ------ 11
    // ------------
    // ------------
    // 00 -------01

    private _width: number;
    private _height: number;
    private _xMax: number;
    private _xMin: number;
    private _yMax: number;
    private _yMin: number;

    constructor(array: Array<number[]>) {
        let points : Point[] = [];
        array.forEach(array => points.push(new Point(array)));
        this._xMax = Math.max.apply(Math, points.map(point => point.x));
        this._xMin = Math.min.apply(Math, points.map(point => point.x));
        this._yMax = Math.max.apply(Math, points.map(point => point.y));
        this._yMin = Math.min.apply(Math, points.map(point => point.y));
        this._width = Math.abs(this._xMax - this._xMin);
        this._height = Math.abs(this._yMax - this._yMin);

        console.log("xMax: " + this._xMax);
        console.log("xMin: " + this._xMin);
        console.log("yMax: " + this._yMax);
        console.log("yMin: " + this._yMin);
        console.log("Width: " + this._width);
        console.log("Height: " + this._height);
    }

    get width() {
        return this._width;
    }

    get height() {
        return this._height;
    }

    get xMax() {
        return this._xMax;
    }

    get xMin() {
        return this._xMin;
    }

    get yMax() {
        return this._yMax;
    }

    get yMin() {
        return this._yMin;
    }
}