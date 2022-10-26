import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {RegistrationService} from 'src/app/services/registration.service';
import {MetadataService} from "src/app/services/metadata.service";
import {Metadata} from "../../models/metadata.model";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {showErrorDialog} from "../../util/showErrorModal";

@Component({
    selector: 'app-registration',
    templateUrl: './registration.component.html',
    styleUrls: ['./registration.component.css'],
})

export class RegistrationComponent implements OnInit {
    modalRef!: BsModalRef;
    startRegistration: boolean = false;
    registration_id: string = '';
    buttonSubmitString = "Salva e avvia registrazione";
    registration!: Metadata;

    constructor(
        private route: Router,
        private metadataService: MetadataService,
        private registrationService: RegistrationService,
        private modalService: BsModalService,
    ) {
    }

    ngOnInit(): void {
        this.registrationService.checkRegistration().subscribe((response) => {
            console.log(response);
            this.startRegistration = response;
        });
    }

    stopRegistration(): void {
        this.registrationService.stopRegistration().subscribe(
            (response) => console.log(response),
            (error) => {
                this.modalRef = showErrorDialog(error.message, this.modalService);
                console.log(error);
            }
        );
        //passa a lista dei match
        console.log("Registrazione terminata");
        this.metadataService.updateEndTimestamp(this.registration_id, new Date()).subscribe(
            (response) => {
                console.log(response);
                console.log("Added end timestamp to metadata");
                this.startRegistration = false;
            },
            (error) => {
                this.modalRef = showErrorDialog(error.message, this.modalService);
                console.log(error);
            }
        );

    }

    saveAndStart($event: Metadata) {
        this.metadataService.create($event).subscribe(
            (response) => {
                console.log(response);
                this.startRegistration = true;
                console.log("start:" + this.startRegistration);
                this.registrationService.startRegistration(this.registration_id).subscribe(
                    (response) => console.log(response),
                    (error) => {
                        this.modalRef = showErrorDialog(error.message, this.modalService);
                        console.log(error);
                    }
                );
            },
            (error) => {
                this.modalRef = showErrorDialog(error.message, this.modalService);
                console.log(error);
            }
        );
    }
}
