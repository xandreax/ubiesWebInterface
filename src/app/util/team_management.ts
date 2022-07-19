import {Team} from "../models/team.model";

export function checkTeamNotDuplicate(teams: Team[], newTeam: Team, oldTeam: Team | null): boolean {
    let errorTeam = false;
    teams.forEach(team => {
        if (oldTeam == null) {
            if (newTeam.name == team.name) {
                errorTeam = true;
                return;
            }
            if (newTeam.colour == team.colour) {
                errorTeam = true;
                return;
            }
        } else {
            if (newTeam.name == team.name && newTeam.name != oldTeam.name) {
                errorTeam = true;
                return;
            }
            if (newTeam.colour == team.colour && newTeam.colour != oldTeam.colour) {
                errorTeam = true;
                return;
            }
        }
    });
    return errorTeam;
}

export function checkTeamInfoIsComplete(team: Team): boolean {
    return team.name != '' && team.colour != '';
}