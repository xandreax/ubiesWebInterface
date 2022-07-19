/*export interface TagData {
    tag:{
        protocol: number;
        timestamp: Date;
        id: number;
        temp: number;
        batt: number;
        position: Array<number>;
        hposition: Array<number>;
        acc: Array<number>;
        gyro: Array<number>;
    }
}*/

export class TagData {
    public tag:{
        protocol: number;
        timestamp: Date;
        id: number;
        temp: number;
        batt: number;
        position: number[];
        hposition: number[];
        acc: number[];
        gyro: number[];
    }


    constructor(tag: { protocol: number; timestamp: Date; id: number; temp: number; batt: number; position: Array<number>; hposition: Array<number>; acc: Array<number>; gyro: Array<number> }) {
        this.tag = {
            protocol: tag.protocol,
            timestamp: tag.timestamp,
            id: tag.id,
            temp: tag.temp,
            batt: tag.batt,
            position: tag.position,
            hposition: tag.hposition,
            acc: tag.acc,
            gyro: tag.gyro
        }
    }
}
