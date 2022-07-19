import {Component, OnInit, TemplateRef} from '@angular/core';
import {MetadataService} from 'src/app/services/metadata.service';
import {Metadata} from 'src/app/models/metadata.model';
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {Router} from "@angular/router";
import {PageChangedEvent} from "ngx-bootstrap/pagination";
import {ModalYesNoComponent} from "../modals/modal-yes-no/modal-yes-no.component";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
    matches: Metadata[] = [];
    modalRef!: BsModalRef;
    returnedMatches: Metadata[] = [];

    constructor(
        private matchesService: MetadataService,
        private modalService: BsModalService,
        private route: Router,
    ) {
    }

    ngOnInit(): void {
        this.getAllMatches();
    }

    getAllMatches(): void {
        this.matchesService.getAll().subscribe(
            (data) => {
                this.matches = data;
                this.returnedMatches = this.matches.slice(0,10);
            },
            (error) => {
                console.log(error);
            }
        );
    }

    pageChanged(event: PageChangedEvent): void {
        const startItem = (event.page - 1) * event.itemsPerPage;
        const endItem = event.page * event.itemsPerPage;
        this.returnedMatches = this.matches.slice(startItem, endItem);
    }

    goToRegistration(): void {
        this.route.navigate(["/registration"]);
    }

    deleteMatch(match: Metadata): void {
        const text= 'Vuoi veramente cancellare la registrazione?';
        const config = {
            initialState: {text},
        };
        this.modalRef = this.modalService.show(ModalYesNoComponent, config);
        this.modalRef.content.event.subscribe((response: boolean) => {
                console.log(response);
                if(response){
                    this.matchesService.delete(match.registration_id).subscribe(
                        (res) => {
                            console.log(res.message);
                            this.getAllMatches();
                        },
                        (err) => console.log(err)
                    );
                }
            }
        );
    }

    getLengthPeriodOfRegistration(match: Metadata):string {
        if(match.end_registration_timestamp != undefined){
            console.log(match.end_registration_timestamp);
            let initDate = new Date(match.timestamp);
            let endDate = new Date(match.end_registration_timestamp);
            let diffMs = endDate.getTime() - initDate.getTime();
            const secs = Math.floor(Math.abs(diffMs) / 1000);
            const mins = Math.floor(secs / 60);
            const hours = Math.floor(mins / 60);
            let diffHrs = (hours % 24).toLocaleString('it-IT', {
                minimumIntegerDigits: 2,
                useGrouping: false
            });
            let diffMins = (mins % 60).toLocaleString('it-IT', {
                minimumIntegerDigits: 2,
                useGrouping: false
            });
            let diffSec = (secs % 60).toLocaleString('it-IT', {
                minimumIntegerDigits: 2,
                useGrouping: false
            });
            return diffHrs+ ":" + diffMins + ":" + diffSec;
        }
        else{
            console.log("non disponibile");
            return "non disponibile";
        }
    }
}
