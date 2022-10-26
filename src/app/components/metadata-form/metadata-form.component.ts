import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import * as uuid from "uuid";
import {Metadata} from "../../models/metadata.model";
import {Team} from "../../models/team.model";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {Router} from "@angular/router";
import {MetadataService} from "../../services/metadata.service";
import {RegistrationService} from "../../services/registration.service";
import {showErrorDialog} from "../../util/showErrorModal";
import {TeamModalComponent} from "../modals/team-modal/team-modal.component";
import {checkTeamInfoIsComplete, checkTeamNotDuplicate} from "../../util/team_management";

@Component({
    selector: 'app-metadata-form',
    templateUrl: './metadata-form.component.html',
    styleUrls: ['./metadata-form.component.css']
})
export class MetadataFormComponent implements OnInit {
    @Input() name_registration: string = '';
    @Input() registration_id: string = '';
    @Input() type_registration: string = '';
    @Input() length_court: number = Number('');
    @Input() width_court: number = Number('');
    @Input() teams: Team[] = [new Team("Giocatori senza squadra", "#000000")];
    @Input() buttonSubmitString: string = '';
    @Output() submitEvent = new EventEmitter<Metadata>();

    modalRef!: BsModalRef;
    teamsText: string [] = [];
    registrationForm: FormGroup;
    typeControl = new FormControl();
    registration!: Metadata;

    constructor(private route: Router,
                private metadataService: MetadataService,
                private registrationService: RegistrationService,
                private modalService: BsModalService,
                private formBuilder: FormBuilder) {
        this.registrationForm = this.formBuilder.group({
            name: '',
            width_court: '',
            length_court: ''
        });
    }

    ngOnInit(): void {

    }

    submit(): void {
        if (this.registration_id == '') {
            this.registration_id = uuid.v4();
        }
        let name_registration: string = this.registrationForm.get('name')?.value;
        //check the forms
        if (name_registration == '') {
            this.modalRef = showErrorDialog("Nessun nome inserito per la registrazione, inseriscine uno per avviare la registrazione.", this.modalService);
            return;
        }
        let type_registration = this.typeControl.value;
        if (type_registration == null) {
            this.modalRef = showErrorDialog("Non è stata selezionata la modalità della registrazione, selezionane una per avviarla.", this.modalService);
            return;
        }
        let length_court = this.registrationForm.get('length_court')?.value;
        if (length_court == '' || length_court == 0) {
            this.modalRef = showErrorDialog("Non è stata inserita la lunghezza del lato corto del campo, inseriscila uno per avviare la registrazione.", this.modalService);
            return;
        }
        let width_court = this.registrationForm.get('width_court')?.value;
        if (width_court == '' || width_court == 0) {
            this.modalRef = showErrorDialog("Non è stata inserita la lunghezza del lato lungo del campo, inseriscila per avviare la registrazione.", this.modalService);
            return;
        }
        if (this.teams.length == 0) {
            this.modalRef = showErrorDialog("Nessuna squadra inserita. \n Inserisci almeno una squadra per avviare una registrazione.", this.modalService);
            return;
        }

        let errorPlayer = false;
        let team_name;
        this.teams.forEach((team) => {
            if (team.players.length == 0) {
                team_name = team.name;
                errorPlayer = true;
                return;
            }
        });
        if (errorPlayer) {
            this.modalRef = showErrorDialog("Nessuna giocatore inserito nella squadra " + team_name + ". \n Inserisci almeno un giocatore nella squadra per avviare una registrazione.", this.modalService);
            return;
        }
        this.registration = new Metadata(name_registration, this.registration_id, type_registration, length_court,
            width_court, new Date(), this.teams, undefined)
        console.log("metadata");
        console.log(this.registration);
        this.submitEvent.emit(this.registration);
        /*this.registrationForm.reset();
        this.teams = [];
        this.teamsText = [];*/
    }

    insertTeam(newTeam: Team, oldTeam: Team | null) {
        if (oldTeam == null) {
            this.teams.push(newTeam);
            this.teamsText.push(newTeam.name);
        } else {
            let index = this.teamsText.findIndex(value => value == oldTeam.name);
            this.teamsText[index] = newTeam.name;
            this.teams.forEach(team => {
                if (team.name == oldTeam.name) {
                    team.name = newTeam.name;
                    team.colour = newTeam.colour;
                }
            });
        }
    }

    deleteTeam($event: Team) {
        this.teams.forEach((value, index) => {
            if ($event == value) this.teams.splice(index, 1)
        });
        this.teamsText.forEach((value, index) => {
            if ($event.name == value) this.teamsText.splice(index, 1)
        });
    }

    updateTeam($event: { newTeam: Team; oldTeam: Team }) {
        this.insertTeam($event.newTeam, $event.oldTeam);
    }

    addTeamModal() {
        this.modalRef = this.modalService.show(TeamModalComponent);
        this.modalRef.content.event.subscribe((team: Team) => {
                if (checkTeamInfoIsComplete(team)) {
                    if (!checkTeamNotDuplicate(this.teams, team, null)) {
                        console.log(team);
                        this.insertTeam(team, null);
                    } else
                        this.modalRef = showErrorDialog("I dati della squadra sono già presenti in un'altra squadra, ricontrolla i dati inseriti.", this.modalService);
                } else
                    this.modalRef = showErrorDialog("Errore nel form della squadra inserita, assicurati di aver inserito tutti i dati.", this.modalService);
            }
        );
    }
}
