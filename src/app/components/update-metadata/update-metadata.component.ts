import {Component, OnInit} from '@angular/core';
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {Team} from "../../models/team.model";
import {MetadataService} from "../../services/metadata.service";
import {Metadata} from "../../models/metadata.model";
import {ActivatedRoute} from "@angular/router";
import {showErrorDialog} from "../../util/showErrorModal";

@Component({
    selector: 'app-update-metadata',
    templateUrl: './update-metadata.component.html',
    styleUrls: ['./update-metadata.component.css']
})
export class UpdateMetadataComponent implements OnInit {
    modalRef!: BsModalRef;
    registration_id: string = '';
    private id: string = "";
    metadata!: Metadata;

    buttonSubmitString: string = "Salva le modifiche";

    constructor(private modalService: BsModalService,
                private metadataService: MetadataService, private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.id = this.route.snapshot.paramMap.get("id") as string;
        this.metadataService.getMetadataById(this.id).subscribe(
            (response) => {
                this.metadata = response;
            });
    }

    updateChanges($event: Metadata) {
        this.metadataService.update($event).subscribe(
            (response) => {
                console.log(response);
                this.modalRef = showErrorDialog("Modifiche salvate con successo!", this.modalService);
            },
            (error) => {
                this.modalRef = showErrorDialog(error.message, this.modalService);
                console.log(error);
            }
        );
    }
}
