export class Constellation {

    public registration_id: string;
    public constellation: {
        protocol: number,
        timestamp: Date;
        A0: number[],
        A1: number[],
        A2: number[],
        A3: number[],
        A4: number[],
        A5: number[],
        A6: number[],
        A7: number[],
    }

    constructor(registration_id: string, timestamp: Date, constellation: { protocol: number; timestamp: Date;
        A0: number[]; A1: number[]; A2: number[]; A3: number[]; A4: number[]; A5: number[]; A6: number[]; A7: number[] }) {
        this.registration_id = registration_id;
        this.constellation = {
            protocol: constellation.protocol,
            timestamp: constellation.timestamp,
            A0: constellation.A0,
            A1: constellation.A1,
            A2: constellation.A2,
            A3: constellation.A3,
            A4: constellation.A4,
            A5: constellation.A5,
            A6: constellation.A6,
            A7: constellation.A7,
        };
    }
}