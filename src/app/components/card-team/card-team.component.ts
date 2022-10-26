import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Team} from "../../models/team.model";
import {Player} from "../../models/player.model";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {PlayerModalComponent} from "../modals/player-modal/player-modal.component";
import {ModalYesNoComponent} from "../modals/modal-yes-no/modal-yes-no.component";
import {TeamModalComponent} from "../modals/team-modal/team-modal.component";
import {
    checkIfPlayerDataIsComplete,
    checkPlayerNotDuplicate
} from "../../util/player_management";
import {ErrorModalComponent} from "../modals/error-modal/error-modal.component";
import {checkTeamNotDuplicate, checkTeamInfoIsComplete} from "../../util/team_management";

@Component({
    selector: 'app-card-team',
    templateUrl: './card-team.component.html',
    styleUrls: ['./card-team.component.css']
})
export class CardTeamComponent implements OnInit {
    @Input() team!: Team;
    @Input() teams!: Team[];
    @Output() deleteTeamEvent = new EventEmitter<Team>();
    @Output() updateTeamEvent = new EventEmitter<{ newTeam: Team, oldTeam: Team }>();
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

    modifyPlayerModal(team: Team, oldPlayer: Player) {
        const initialState = {
            player: oldPlayer
        }
        this.modalRef = this.modalService.show(PlayerModalComponent, {initialState});
        this.modalRef.content.event.subscribe((newPlayer: Player) => {
                if (checkIfPlayerDataIsComplete(newPlayer)) {
                    if (!checkPlayerNotDuplicate(this.teams, newPlayer, oldPlayer)) {
                        let oldTeam = team;
                        team.players.forEach(player => {
                            if (player.id_tag == oldPlayer.id_tag) {
                                player.id_tag = newPlayer.id_tag;
                                player.name = newPlayer.name;
                                player.kit_number = newPlayer.kit_number;
                            }
                        })
                        console.log(newPlayer);
                        this.updateTeamEvent.emit({newTeam: team, oldTeam: oldTeam});
                    } else {
                        this.showErrorDialog("I dati del giocatore sono già presenti in un'altra squadra, ricontrolla i dati inseriti.");
                    }
                } else {
                    this.showErrorDialog("Errore nel form del giocatore, assicurati di aver inserito tutti i dati.");
                }
            }
        );
    }

    deletePlayerModal(team: Team, player: Player) {
        const text = 'Sei sicuro di voler eliminare il giocatore ' + player.name + '?';
        const config = {
            initialState: {text},
        };
        this.modalRef = this.modalService.show(ModalYesNoComponent, config);
        this.modalRef.content.event.subscribe((response: boolean) => {
                if (response) {
                    let oldTeam = team;
                    team.players.forEach((value, index) => {
                        if (player == value) team.players.splice(index, 1)
                    });
                    this.updateTeamEvent.emit({newTeam: team, oldTeam: oldTeam});
                }
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

    addPlayerModal(team: Team) {
        this.modalRef = this.modalService.show(PlayerModalComponent);
        this.modalRef.content.event.subscribe((response: Player) => {
                if (checkIfPlayerDataIsComplete(response)) {
                    if (!checkPlayerNotDuplicate(this.teams, response, null)) {
                        let oldTeam = team;
                        team.players.push(response);
                        console.log(response);
                        this.updateTeamEvent.emit({newTeam: team, oldTeam: oldTeam});
                    } else {
                        this.showErrorDialog("I dati del giocatore sono già presenti in un'altra squadra, ricontrolla i dati inseriti.");
                    }
                } else {
                    this.showErrorDialog("Errore nel form del giocatore, assicurati di aver inserito tutti i dati.");
                }
            }
        );
    }

    private showErrorDialog(text: string) {
        const initialState = {
            modalText: text
        }
        this.modalRef = this.modalService.show(ErrorModalComponent, {initialState});
    }
}
