export class Player {

    id_tag: number;
    name: string;
    kit_number: number | null;
    isSelected: boolean = false;
    team: string | undefined;

    constructor(idTag: number, name: string, kit_number: number | null, team: string | undefined) {
        this.id_tag = idTag;
        this.name = name;
        this.kit_number = kit_number;
        this.team = team;
    }
}