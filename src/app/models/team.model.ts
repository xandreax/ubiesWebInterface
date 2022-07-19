import {Player} from "./player.model";

export class Team{
    name: string;
    colour: string;
    players: Player[] = [];

    constructor(name: string, colour:string ) {
        this.colour = colour;
        this.name = name;
    }
}