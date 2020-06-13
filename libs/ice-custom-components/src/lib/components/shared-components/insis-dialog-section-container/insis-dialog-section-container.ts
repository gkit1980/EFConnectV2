import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';

import { IcePage, IceSection, PageElement, ItemElement } from '@impeo/ice-core';

@Component({
  selector: 'insis-dialog-section-container',
  templateUrl: 'insis-dialog-section-container.html',
})
export class InsisDialogSectionContainer {
  section: IceSection;

  constructor(
    public dialogRef: MatDialogRef<InsisDialogSectionContainer>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.section = IceSection.build(data.page, data.page, data['section']);
    (data.page as IcePage).sections.pop();
  }

  close(): void {
    this.dialogRef.close();
  }
}
