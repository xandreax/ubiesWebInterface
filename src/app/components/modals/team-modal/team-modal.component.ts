import {Component, EventEmitter, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {Team} from "../../../models/team.model";
import {Player} from "../../../models/player.model";
import {ErrorModalComponent} from "../error-modal/error-modal.component";

@Component({
    selector: 'app-team-modal',
    templateUrl: './team-modal.component.html',
    styleUrls: ['./team-modal.component.css']
})
export class TeamModalComponent implements OnInit {
    teamForm: FormGroup;
    team: Team = new Team("", "");
    public event: EventEmitter<any> = new EventEmitter();
    private modalText: string = "";
    private modalRef!: BsModalRef;

    constructor(private formBuilder: FormBuilder, public bsModalRef: BsModalRef, private modalService: BsModalService) {
        this.teamForm = this.formBuilder.group({
            team_name: '',
            team_color: ''
        });
    }

    ngOnInit(): void {
        this.teamForm.setValue({
            'team_name': this.team.name,
            'team_color': this.team.colour,
        })
    }

    closeModal() {
        this.bsModalRef.hide();
    }

    confirmTeam(teamForm: FormGroup) {
        let team_name = teamForm.get('team_name')?.value;
        let team_color = teamForm.get('team_color')?.value;
        if (team_name != '' && team_color != '') {
            this.triggerEvent(team_name, team_color);
            this.bsModalRef.hide();
        } else {
            this.modalText = "Errore nel form della squadra, assicurati di aver inserito correttamente i dati.";
            const initialState = {
                modalText: this.modalText
            }
            this.modalRef = this.modalService.show(ErrorModalComponent, {initialState});
            this.bsModalRef.hide();
        }
    }

    private triggerEvent(name: string, colour: string) {
        const newTeam = new Team(name, colour);
        this.event.emit(newTeam);
    }
}
