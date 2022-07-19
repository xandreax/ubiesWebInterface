import {Team} from "./team.model";
import {Player} from "./player.model";

export class Metadata {
    name_registration: string;
    registration_id: string;
    type_registration: string;
    length_court: number;
    width_court: number;
    timestamp: Date;
    end_registration_timestamp: Date | undefined;
    teams: Team[] = [];

    constructor(name_registration: string, registration_id: string, type_registration: string, length_court: number, width_court: number, timestamp: Date, teams: Array<any>, end_registration_timestamp: Date | undefined) {
        this.name_registration = name_registration;
        this.registration_id = registration_id;
        this.type_registration = type_registration;
        this.length_court = length_court;
        this.width_court = width_court;
        this.timestamp = timestamp;
        this.end_registration_timestamp = end_registration_timestamp;
        teams.forEach((team => {
            let newTeam = new Team(team.name, team.colour);
            let players: Player[] = [];
            team.players.forEach(((player: { id_tag: number; name: string; kit_number: number | null; }) => {
                players.push(new Player(player.id_tag, player.name, player.kit_number))
            }));
            newTeam.players = players;
            this.teams.push(newTeam);
        }));
    }
}
