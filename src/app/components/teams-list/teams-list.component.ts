import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Team} from "../../models/team.model";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {TeamModalComponent} from "../modals/team-modal/team-modal.component";
import {checkTeamInfoIsComplete, checkTeamNotDuplicate} from "../../util/team_management";
import {ErrorModalComponent} from "../modals/error-modal/error-modal.component";
import {ModalYesNoComponent} from "../modals/modal-yes-no/modal-yes-no.component";
import {showErrorDialog} from "../../util/showErrorModal";

@Component({
    selector: 'app-teams-list',
    templateUrl: './teams-list.component.html',
    styleUrls: ['./teams-list.component.css']
})
export class TeamsListComponent implements OnInit {
    @Input() teams!: Team[];
    @Output() deleteTeamEvent = new EventEmitter<Team>();
    @Output() updateTeamEvent = new EventEmitter<{ newTeam: Team, oldTeam: Team }>();
    @Output() addTeamEvent = new EventEmitter<Team>();
    modalRef!: BsModalRef;

    constructor(private modalService: BsModalService) {
    }

    ngOnInit(): void {
    }

    modifyTeamModal(team: Team) {
        const initialState = {
            team: team
        }
        this.modalRef = this.modalService.show(TeamModalComponent, {initialState});
        this.modalRef.content.event.subscribe((updatedTeam: Team) => {
                if (checkTeamInfoIsComplete(updatedTeam)) {
                    if (!checkTeamNotDuplicate(this.teams, updatedTeam, team)) {
                        console.log(updatedTeam);
                        this.updateTeamEvent.emit({newTeam: updatedTeam, oldTeam: team});
                    } else
                        this.showErrorDialog("I dati della squadra sono già presenti in un'altra squadra, ricontrolla i dati inseriti.");
                } else
                    this.showErrorDialog("Errore nel form della squadra inserita, assicurati di aver inserito tutti i dati.");
            }
        );
    }

    deleteTeamModal(team: Team) {
        const text = 'Sei sicuro di voler eliminare il team ' + team.name + '?';
        const config = {
            initialState: {text},
        };
        this.modalRef = this.modalService.show(ModalYesNoComponent, config);
        this.modalRef.content.event.subscribe((response: boolean) => {
                if (response)
                    this.deleteTeamEvent.emit(team);
            }
        );
    }

    private showErrorDialog(text: string) {
        const initialState = {
            modalText: text
        }
        this.modalRef = this.modalService.show(ErrorModalComponent, {initialState});
    }

    addTeamModal() {
        this.modalRef = this.modalService.show(TeamModalComponent);
        this.modalRef.content.event.subscribe((team: Team) => {
                if (checkTeamInfoIsComplete(team)) {
                    if (!checkTeamNotDuplicate(this.teams, team, null)) {
                        this.addTeamEvent.emit(team);
                    } else
                        this.modalRef = showErrorDialog("I dati della squadra sono già presenti in un'altra squadra, ricontrolla i dati inseriti.", this.modalService);
                } else
                    this.modalRef = showErrorDialog("Errore nel form della squadra inserita, assicurati di aver inserito tutti i dati.", this.modalService);
            }
        );
    }
}
