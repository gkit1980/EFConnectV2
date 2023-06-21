import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '@insis-portal/services/modal.service';

@Component({
  selector: 'app-sign-up-group-errorService-modal',
  templateUrl: './sign-up-group-errorService-modal.component.html',
  styleUrls: ['./sign-up-group-errorService-modal.component.scss']
})
export class SignUpGroupErrorServiceModalComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal,
              private modalService: ModalService) { }

  ngOnInit() {
  }


}
