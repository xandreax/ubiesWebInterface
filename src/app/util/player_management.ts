import {Team} from "../models/team.model";
import {Player} from "../models/player.model";

export function checkPlayerNotDuplicate(teams: Team[], newPlayer: Player, oldPlayer: Player | null): boolean{
    let errorPlayer = false;
    teams.forEach(team => {
        team.players.forEach(player => {
            if (oldPlayer != null) {
                if (player.id_tag == newPlayer.id_tag && newPlayer.id_tag != oldPlayer.id_tag) {
                    errorPlayer = true;
                    return;
                }
                if (player.kit_number == newPlayer.kit_number && newPlayer.kit_number != oldPlayer.kit_number) {
                    errorPlayer = true;
                    return;
                }
            } else {
                if (player.id_tag == newPlayer.id_tag) {
                    errorPlayer = true;
                    return;
                }
                if (player.name == newPlayer.name && player.kit_number != newPlayer.kit_number) {
                    errorPlayer = true;
                    return;
                }
                if (player.name != newPlayer.name && player.kit_number == newPlayer.kit_number) {
                    errorPlayer = true;
                    return;
                }
            }
        });
    })
    return errorPlayer;
}

export function checkIfPlayerDataIsComplete(player: Player): boolean{
    return player.id_tag > 0 && player.name != '';
}