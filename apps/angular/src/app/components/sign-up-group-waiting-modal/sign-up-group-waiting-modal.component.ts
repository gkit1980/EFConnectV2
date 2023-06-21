import { Component, OnInit } from '@angular/core';
import { environment } from "@insis-portal/environments/environment";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '@insis-portal/services/modal.service';

@Component({
  selector: 'app-sign-up-group-waiting-modal',
  templateUrl: './sign-up-group-waiting-modal.component.html',
  styleUrls: ['./sign-up-group-waiting-modal.component.scss']
})
export class SignUpGroupWaitingModalComponent implements OnInit {

  errMsgService: string;

  constructor(public activeModal: NgbActiveModal,
              private modalService: ModalService) { }

  ngOnInit() {
  }


}
