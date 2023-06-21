import { Injectable, EventEmitter } from '@angular/core';
import { SignUpGroupSuccessModalComponent } from '../components/sign-up-group-success-modal/sign-up-group-success-modal.component';

@Injectable()
export class ModalService {
  open(SignUpGroupSuccessModalComponent: SignUpGroupSuccessModalComponent, arg1: { windowClass: string; }) {
    throw new Error('Method not implemented.');
  }
  modalOpened = new EventEmitter<boolean>();
  constructor() { }

  ismodalOpened() {
    this.modalOpened.emit(true);
  }

  isModalClosed() {
    this.modalOpened.emit(false);
  }
}
