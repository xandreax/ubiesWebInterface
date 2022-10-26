import {Component, EventEmitter, OnInit} from '@angular/core';
import {BsModalRef} from "ngx-bootstrap/modal";

@Component({
    selector: 'app-modal-yes-no',
    templateUrl: './modal-yes-no.component.html',
    styleUrls: ['./modal-yes-no.component.css']
})
export class ModalYesNoComponent implements OnInit {
    text: string = "";
    public event: EventEmitter<any> = new EventEmitter();

    constructor(public bsModalRef: BsModalRef) {
    }

    ngOnInit(): void {
    }

    confirm() {
        this.triggerEvent(true);
        this.bsModalRef.hide();
    }

    decline() {
        this.triggerEvent(false);
        this.bsModalRef.hide();
    }

    private triggerEvent(response: boolean) {
        this.event.emit(response);
    }
}
