export class TagData {
    protocol: number;
    timestamp: Date;
    id: number;
    temp: number;
    batt: number;
    position: number[];
    hposition: number[];
    acc: number[];
    gyro: number[];

    constructor(protocol: number, timestamp: Date, id: number, temp: number, batt: number, position: Array<number>, hposition: Array<number>, acc: Array<number>, gyro: Array<number>) {
        this.protocol = protocol;
        this.timestamp = timestamp;
        this.id = id;
        this.temp = temp;
        this.batt = batt;
        this.position = position;
        this.hposition = hposition;
        this.acc = acc;
        this.gyro = gyro;
    }
}
