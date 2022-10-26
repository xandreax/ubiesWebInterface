import {Component, OnInit} from '@angular/core';
import {BsModalRef} from "ngx-bootstrap/modal";
import {Metadata} from "../../../models/metadata.model";

@Component({
    selector: 'app-info-modal',
    templateUrl: './info-modal.component.html',
    styleUrls: ['./info-modal.component.css']
})
export class InfoModalComponent implements OnInit {
    metadata!: Metadata;

    constructor(public bsModalRef: BsModalRef) {
    }

    ngOnInit(): void {
    }

    close() {
        this.bsModalRef.hide();
    }
}
