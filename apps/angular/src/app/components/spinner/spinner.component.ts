import { Component } from '@angular/core';
import { SpinnerService } from '../../services/spinner.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
})
export class SpinnerComponent {
  spinnerVisible: boolean;

  //
  //
  constructor(private spinnerService: SpinnerService) {
    this.spinnerVisible = false;
    this.spinnerService.visible.subscribe((isVisible) => (this.spinnerVisible = isVisible));
  }
}
