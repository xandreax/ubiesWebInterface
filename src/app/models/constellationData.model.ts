export class Constellation {

    registration_id: string;
    protocol: number;
    timestamp: Date;
    A0: number[];
    A1: number[];
    A2: number[];
    A3: number[];
    A4: number[];
    A5: number[];
    A6: number[];
    A7: number[];

    constructor(registration_id: string,
        protocol: number, timestamp: Date,
        A0: number[], A1: number[], A2: number[], A3: number[], A4: number[], A5: number[], A6: number[], A7: number[]
    ) {
        this.registration_id = registration_id;
        this.protocol = protocol;
        this.timestamp = timestamp;
        this.A0 = A0;
        this.A1 = A1;
        this.A2 = A2;
        this.A3 = A3;
        this.A4 = A4;
        this.A5 = A5;
        this.A6 = A6;
        this.A7 = A7;
    }
}