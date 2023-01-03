import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import * as uuid from "uuid";
import {Metadata} from "../../models/metadata.model";
import {Team} from "../../models/team.model";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {Router} from "@angular/router";
import {MetadataService} from "../../services/metadata.service";
import {RegistrationService} from "../../services/registration.service";
import {showErrorDialog} from "../../util/showErrorModal";
import {Player} from "../../models/player.model";
import {Squads} from "../../models/squads.model";

@Component({
    selector: 'app-metadata-form',
    templateUrl: './metadata-form.component.html',
    styleUrls: ['./metadata-form.component.css']
})
export class MetadataFormComponent implements OnInit {
    @Input() name_registration: string = '';
    @Input() registration_id: string = '';
    @Input() length_court: number = Number('');
    @Input() width_court: number = Number('');
    @Input() teams: Team[] = [];
    @Input() players: Player[] = [];
    @Input() buttonSubmitString: string = '';
    @Output() submitEvent = new EventEmitter<Metadata>();

    modalRef!: BsModalRef;
    teamsText: string [] = [];
    registrationForm: FormGroup;
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

        if (this.players.length == 0) {
            this.modalRef = showErrorDialog("Nessuna giocatore inserito. \n Inserisci almeno un giocatore per avviare una registrazione.", this.modalService);
            return;
        }

        this.registration = new Metadata(name_registration, this.registration_id, length_court,
            width_court, new Date(), new Squads(this.teams, this.players), undefined)
        console.log("metadata");
        console.log(this.registration);
        this.submitEvent.emit(this.registration);
    }

    insertTeam(newTeam: Team, oldTeam: Team | null) {
        if(this.teams == null)
            this.teams = [];
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
        this.players.forEach(player =>{
            if($event.name == player.team){
                player.team = 'Nessuna squadra';
            }
        });
    }

    updateTeam($event: { newTeam: Team; oldTeam: Team }) {
        this.insertTeam($event.newTeam, $event.oldTeam);
    }

    deletePlayer($event: Player) {
        this.players.forEach((value, index) => {
            if ($event == value) this.players.splice(index, 1)
        });
    }

    updatePlayer($event: { newPlayer: Player; oldPlayer: Player }) {
        this.insertPlayer($event.newPlayer, $event.oldPlayer);
    }

    insertPlayer(newPlayer: Player, oldPlayer: Player | null) {
        if(this.players == null)
            this.players = [];
        if (oldPlayer == null) {
            this.players.push(newPlayer);
        } else {
            this.players.forEach(player => {
                if (player.name == oldPlayer.name) {
                    player.name = newPlayer.name;
                    player.id_tag = newPlayer.id_tag;
                    player.kit_number = newPlayer.kit_number;
                    player.team = newPlayer.team;
                }
            });
        }
    }

    addPlayer($event: Player) {
        this.insertPlayer($event, null);
    }

    addTeam($event: Team) {
        this.insertTeam($event, null);
    }
}
