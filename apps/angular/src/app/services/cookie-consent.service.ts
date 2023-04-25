import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class CookieConsentService {
  consentModalOpen = new EventEmitter<boolean>();
  numOfClicks: number = 0;


  constructor() { }

  addClick() {
   this.numOfClicks++;
  }

  resetClicks()
  {
    this.numOfClicks=0;
  }

  getClicks():number
  {
  return this.numOfClicks;
  }

  openConsentDialog() {
    this.consentModalOpen.emit(true);
  }

  closeConsentDialog() {
    this.consentModalOpen.emit(false);
  }
}
