import {Point} from "../cartesian/point.model";
import {TransformationMatrix} from "../cartesian/transformation_matrix.model";
import {AnchorsPositions} from "./dimensions_court";


export class Court {

    private point00: Point;
    private point01: Point;
    private point10: Point;
    private point11: Point;
    private _ratio: number;
    private _height: number;
    private _width: number;
    private matrix: TransformationMatrix;

    constructor(dimensions: AnchorsPositions) {
        if (dimensions.height > dimensions.width) {
            // Court axis
            // 01 ------ 00
            // ------------
            // ------------
            // ------------
            // ------------
            // ------------
            // 11 -------10
            this.point00 = new Point([dimensions.xMax, dimensions.yMax]);
            this.point01 = new Point([dimensions.xMin, dimensions.yMax]);
            this.point10 = new Point([dimensions.xMax, dimensions.yMin]);
            this.point11 = new Point([dimensions.xMin, dimensions.yMin]);
            this._ratio = dimensions.height / dimensions.width;
            this._width = dimensions.height;
            this._height = dimensions.width;
        } else {
            // Court axis
            // 00 ------------ 10
            // ------------------
            // ------------------
            // 01 ------------ 11
            this.point00 = new Point([dimensions.xMin, dimensions.yMax]);
            this.point01 = new Point([dimensions.xMin, dimensions.yMin]);
            this.point10 = new Point([dimensions.xMax, dimensions.yMax]);
            this.point11 = new Point([dimensions.xMax, dimensions.yMin]);
            this._ratio = dimensions.width / dimensions.height;
            this._width = dimensions.width;
            this._height = dimensions.height;
        }
        //this.point11 = this.imposeRectangularField();
        //this._ratio = dimensions.width / dimensions.height;
        console.log("Court Origin x:" + this.point00.x + " y:" + this.point00.y);
        console.log(
            "Court Long edge vertex from origin x:" +
            this.point10.x +
            " y:" +
            this.point10.y
        );
        console.log(
            "Court Short edge vertex from origin x:" +
            this.point01.x +
            " y:" +
            this.point01.y
        );

        console.log(
            "Court opposite vertex from origin x:" +
            this.point11.x +
            " y:" +
            this.point11.y
        );
        console.log("Ratio Long edge on Short Edge: " + this._ratio);
        let angleRotation, angle;

        if (dimensions.height > dimensions.width) {
            //angle of the line from point11 to point00
            angle = this.point00.angle(this.point11);
        } else {
            //angle of the line from point01 to point10
            angle = this.point01.angle(this.point10);
        }

        //scale to a ratio 0%1
        let sx = 1 / dimensions.width;
        let sy = 1 / dimensions.height;

        // translate to (0,0)
        let tx = -this.point00.x;
        let ty = -this.point00.y;

        if (angle > ((45 * Math.PI) / 180)) {
            angleRotation = (90 * Math.PI) / 180;
        } else {
            angleRotation = 0;
        }

        console.log("Angle in radians: " + angle);
        console.log("Angle for rotation: " + angleRotation);
        console.log("Delta for translation x:" + tx + " y:" + ty);
        console.log("Scale for resizing x:" + sx + "y:" + sy);

        this.matrix = new TransformationMatrix(sx, sy, angleRotation, tx, ty);

        console.log("P00" + JSON.stringify(this.matrix.applyToPoint(this.point00)));
        console.log("P10" + JSON.stringify(this.matrix.applyToPoint(this.point10)));
        console.log("P01" + JSON.stringify(this.matrix.applyToPoint(this.point01)));
        console.log("P11" + JSON.stringify(this.matrix.applyToPoint(this.point11)));

        console.log("central point:" + JSON.stringify(this.matrix.applyToPoint(new Point([2, 5]))));
    }


    public projectPlayerOnCourt(point: Point): Point {
        return this.matrix.applyToPoint(point);
    }

    get ratio() {
        return this._ratio;
    }

    get width(): number {
        return this._width;
    }
    get height(): number {
        return this._height;
    }
}
