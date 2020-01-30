import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { fadeOut } from '../../animations/fade-out.animation';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: 'alert.component.html',
  animations: [fadeOut]
})
export class AlertComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  message: any;

  constructor(private alertService: AlertService) {}

  ngOnInit() {
    this.subscription = this.alertService.getMessage().subscribe(message => {
      this.message = message;

      if (this.message) {
        if (!this.message.dismiss) this.message.dismiss = 5000;

        setTimeout(() => {
          this.message = null;
        }, this.message.dismiss);
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
