import {ErrorModalComponent} from "../components/modals/error-modal/error-modal.component";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";

export function showErrorDialog(text: string, modalService: BsModalService): BsModalRef {
    const initialState = {
        modalText: text
    }
    return modalService.show(ErrorModalComponent, {initialState});
}