export class Player {

    id_tag: number;
    name: string;
    kit_number: number | null;
    isSelected: boolean = false;

    constructor(idTag: number, name: string, kit_number: number | null) {
        this.id_tag = idTag;
        this.name = name;
        this.kit_number = kit_number;
    }
}