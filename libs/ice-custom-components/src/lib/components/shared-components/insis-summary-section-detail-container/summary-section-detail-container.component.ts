import { Component, Input } from '@angular/core';
import { SummarySectionDetailItem } from './summary-section-detail-item';

@Component({
  selector: 'summary-section-detail-container',
  templateUrl: './summary-section-detail-container.html'
})
export class SummarySectionDetailContainer {
  @Input()
  title: string;

  @Input()
  items: SummarySectionDetailItem[];
}
