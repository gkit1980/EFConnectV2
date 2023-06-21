import { Component, OnInit } from '@angular/core';
import { SectionComponentImplementation, IceSectionComponent } from '@impeo/ng-ice';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '@insis-portal/services/modal.service';

@Component({
  selector: 'app-close-cancel-pop-up',
  templateUrl: './close-cancel-pop-up.component.html',
  styleUrls: ['./close-cancel-pop-up.component.scss']
})
export class CloseCancelPopUpComponent extends SectionComponentImplementation implements OnInit {

  constructor(parent: IceSectionComponent, private ngbActiveModal: NgbActiveModal, private modalService: ModalService) {
    super(parent);
  }

  ngOnInit() {
  }

  closePopUp() {
    this.modalService.isModalClosed();
    this.ngbActiveModal.close();
  }

}
