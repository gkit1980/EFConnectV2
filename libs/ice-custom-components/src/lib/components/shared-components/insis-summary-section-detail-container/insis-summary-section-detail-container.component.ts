import { Component, Input } from '@angular/core';
import { SummarySectionDetailItem } from './insis-summary-section-detail-item';

@Component({
  selector: 'insis-summary-section-detail-container',
  templateUrl: './insis-summary-section-detail-container.html'
})
export class InsisSummarySectionDetailContainer {
  @Input()
  title: string;

  @Input()
  items: SummarySectionDetailItem[];
}
