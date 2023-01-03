import {Team} from "./team.model";
import {Player} from "./player.model";

export class Squads {

    teams: Team[];
    players: Player[];

    constructor(teams: Team[], players: Player[]) {
        this.teams = teams;
        this.players = players;
    }
}