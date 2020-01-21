import { Component } from '@angular/core';
import { IceRuntimeService } from '@impeo/ng-ice';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  //
  //
  constructor(private iceRuntimeService: IceRuntimeService) {
    this.iceRuntimeService.getRuntime();
  }
}
