import {Team} from "./team.model";
import {Player} from "./player.model";
import {Squads} from "./squads.model";

export class Metadata {
    name_registration: string;
    registration_id: string;
    length_court: number;
    width_court: number;
    timestamp: Date;
    end_registration_timestamp: Date | undefined;
    //teams: Team[] = [];
    squads: Squads;

    /*constructor(name_registration: string, registration_id: string, length_court: number, width_court: number, timestamp: Date, teams: Array<any>, end_registration_timestamp: Date | undefined) {
        this.name_registration = name_registration;
        this.registration_id = registration_id;
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
    }*/
    constructor(name_registration: string, registration_id: string, length_court: number, width_court: number, timestamp: Date, squads: {teams: Team[], players: Player[]}, end_registration_timestamp: Date | undefined) {
        this.name_registration = name_registration;
        this.registration_id = registration_id;
        this.length_court = length_court;
        this.width_court = width_court;
        this.timestamp = timestamp;
        this.end_registration_timestamp = end_registration_timestamp;
        let arrayTeam: Team[] = [];
        let arrayPlayers: Player[] = [];
        if(squads.teams != null){
            squads.teams.forEach((team: { name: string; colour: string; }) => {
                let newTeam = new Team(team.name, team.colour);
                arrayTeam.push(newTeam);
            });
        }
        squads.players.forEach((player: { id_tag: number; name: string; kit_number: number | null; team: string | undefined;}) => {
            let newPlayer = new Player(player.id_tag, player.name, player.kit_number, player.team);
            arrayPlayers.push(newPlayer);
        });
        // @ts-ignore
        this.squads = new Squads(arrayTeam, arrayPlayers);
    }
}
