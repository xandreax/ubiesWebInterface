import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Player} from "../../models/player.model";
import {PlayerModalComponent} from "../modals/player-modal/player-modal.component";
import {checkIfPlayerDataIsComplete, checkPlayerNotDuplicate} from "../../util/player_management";
import {ErrorModalComponent} from "../modals/error-modal/error-modal.component";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {Team} from "../../models/team.model";
import {ModalYesNoComponent} from "../modals/modal-yes-no/modal-yes-no.component";
import {showErrorDialog} from "../../util/showErrorModal";

@Component({
    selector: 'app-players-list',
    templateUrl: './players-list.component.html',
    styleUrls: ['./players-list.component.css']
})
export class PlayersListComponent implements OnInit {
    @Input() players: Player[] | undefined;
    @Input() teams: Team[] | undefined;
    @Output() deletePlayerEvent = new EventEmitter<Player>();
    @Output() updatePlayerEvent = new EventEmitter<{ newPlayer: Player, oldPlayer: Player }>();
    @Output() addPlayerEvent = new EventEmitter<Player>();
    modalRef!: BsModalRef;
    teamsText: string[] = [];

    constructor(private modalService: BsModalService) {
    }

    ngOnInit(): void {
        this.teams?.forEach(team => {
            this.teamsText.push(team.name);
        })
    }

    modifyPlayerModal(oldPlayer: Player) {
        const initialState = {
            player: oldPlayer,
            teams: this.teamsText
        }
        this.modalRef = this.modalService.show(PlayerModalComponent, {initialState});
        this.modalRef.content.event.subscribe((newPlayer: Player) => {
                if (checkIfPlayerDataIsComplete(newPlayer)) {
                    if (!checkPlayerNotDuplicate(this.players, newPlayer, oldPlayer)) {
                        this.updatePlayerEvent.emit({newPlayer: newPlayer, oldPlayer: oldPlayer})
                    } else {
                        showErrorDialog("I dati del giocatore sono già presenti, ricontrolla i dati inseriti.", this.modalService);
                    }
                } else {
                    this.showErrorDialog("Errore nel form del giocatore, assicurati di aver inserito tutti i dati.");
                }
            }
        );
    }

    deletePlayerModal(deletingPlayer: Player) {
        const text = 'Sei sicuro di voler eliminare il giocatore ' + deletingPlayer.name + '?';
        const config = {
            initialState: {text},
        };
        this.modalRef = this.modalService.show(ModalYesNoComponent, config);
        this.modalRef.content.event.subscribe((response: boolean) => {
                if (response) {
                    // @ts-ignore
                    this.players.forEach((player, index) => {
                        if (player == deletingPlayer) { // @ts-ignore
                            this.players.splice(index, 1)
                        }
                    });
                    this.deletePlayerEvent.emit(deletingPlayer);
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

    addPlayerModal() {
        this.teamsText = [];
        this.teams?.forEach(team => {
            this.teamsText.push(team.name);
        });
        let initialState;
        if (this.teams != undefined) {
            initialState = {
                teams: this.teamsText,
            }
        }
        this.modalRef = this.modalService.show(PlayerModalComponent, {initialState});
        this.modalRef.content.event.subscribe((response: Player) => {
                if (checkIfPlayerDataIsComplete(response)) {
                    if (!checkPlayerNotDuplicate(this.players, response, null)) {
                        this.addPlayerEvent.emit(response);
                    } else {
                        showErrorDialog("I dati del giocatore sono già presenti, ricontrolla i dati inseriti.", this.modalService);
                    }
                } else {
                    showErrorDialog("Errore nel form del giocatore, assicurati di aver inserito tutti i dati.", this.modalService);
                }
            }
        );
    }

    getTeamColour(team: string | undefined): string {
        if (team == undefined || team == 'Nessuna squadra')
            return '#FFFFFF';
        else {
            let colour = '';
            this.teams?.forEach(value => {
                if (value.name == team) {
                    colour = value.colour;
                }
            })
            return colour;
        }
    }
}