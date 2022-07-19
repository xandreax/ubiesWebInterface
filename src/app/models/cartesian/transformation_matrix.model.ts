import { applyToPoint, compose, Matrix, rotate, scale, translate } from 'transformation-matrix';
import { Point } from './point.model';

export class TransformationMatrix {

    private matrix: Matrix;

    constructor(sx: number,sy: number, angle: number, tx: number,ty: number) {
        this.matrix = compose(
            rotate(angle),
            scale(sx, sy),
            translate(tx, ty)
        );
    }

    public applyToPoint(point:Point): Point{
        return <Point>applyToPoint(this.matrix, point);
    }
}