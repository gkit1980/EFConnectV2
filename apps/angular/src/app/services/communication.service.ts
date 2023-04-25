import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {

  constructor() { }

  private emitChangeSource = new Subject<any>();

  changeEmitted = this.emitChangeSource.asObservable();

  emitChange(data: any) {
    this.emitChangeSource.next(data)
  }
}
