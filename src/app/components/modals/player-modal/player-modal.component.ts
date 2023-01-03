import {Component, EventEmitter, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Player} from "../../../models/player.model";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {ErrorModalComponent} from "../error-modal/error-modal.component";

@Component({
    selector: 'app-player-modal',
    templateUrl: './player-modal.component.html',
    styleUrls: ['./player-modal.component.css']
})
export class PlayerModalComponent implements OnInit {
    playerForm: FormGroup;
    player: Player = new Player(0, "", null, undefined);
    teams: string[] = [];
    teamSelected: string | undefined = '';
    public event: EventEmitter<any> = new EventEmitter();
    private modalText: string = "";
    private modalRef!: BsModalRef;
    typeControl = new FormControl();

    constructor(private formBuilder: FormBuilder, public bsModalRef: BsModalRef, private modalService: BsModalService,) {
        this.playerForm = this.formBuilder.group({
            id_tag: '',
            player_name: '',
            kit_number: '',
        });
    }

    ngOnInit(): void {
        this.playerForm.setValue({
            'id_tag': this.player.id_tag,
            'player_name': this.player.name,
            'kit_number': this.player.kit_number,
        })
        this.teamSelected = this.player.team;
        if (this.teams == [] || !this.teams.includes('Nessuna squadra'))
            this.teams.push('Nessuna squadra');
    }

    confirmAddPlayer(form: FormGroup) {
        let player_name = form.get('player_name')?.value;
        let player_kit_number = form.get('kit_number')?.value;
        let id_tag = this.playerForm.get('id_tag')?.value;
        let teamSelected = this.typeControl.value;
        console.log(teamSelected);
        if (id_tag > 0 && player_name != '' && player_kit_number >= 0) {
            this.triggerEvent(id_tag, player_name, player_kit_number, teamSelected);
            this.bsModalRef.hide();
        } else {
            this.modalText = "Errore nel form del giocatore, assicurati di aver inserito correttamente tutti i dati.";
            const initialState = {
                modalText: this.modalText
            }
            this.modalRef = this.modalService.show(ErrorModalComponent, {initialState});
            this.bsModalRef.hide();
        }
    }

    closeModal() {
        this.bsModalRef.hide();
    }

    private triggerEvent(id_tag: number, name: string, kit_number: number, team: string | undefined) {
        const newPlayer = new Player(id_tag, name, kit_number, team);
        this.event.emit(newPlayer);
    }
}
