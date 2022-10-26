import {Component, EventEmitter, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
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
    player: Player = new Player(0, "", 0);
    public event: EventEmitter<any> = new EventEmitter();
    private modalText: string = "";
    private modalRef!: BsModalRef;

    constructor(private formBuilder: FormBuilder, public bsModalRef: BsModalRef, private modalService: BsModalService,) {
        this.playerForm = this.formBuilder.group({
            id_tag: '',
            player_name: '',
            kit_number: ''
        });
    }

    ngOnInit(): void {
        this.playerForm.setValue({
            'id_tag': this.player.id_tag,
            'player_name': this.player.name,
            'kit_number': this.player.kit_number
        })
    }

    confirmAddPlayer(form: FormGroup) {
        let player_name = form.get('player_name')?.value;
        let player_kit_number = form.get('kit_number')?.value;
        let id_tag = this.playerForm.get('id_tag')?.value;
        if (id_tag > 0 && player_name != '' && player_kit_number >= 0) {
            this.triggerEvent(id_tag, player_name, player_kit_number);
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

    private triggerEvent(id_tag: number, name: string, kit_number: number) {
        const newPlayer = new Player(id_tag, name, kit_number);
        this.event.emit(newPlayer);
    }
}
