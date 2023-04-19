import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';

import { IcePage, IceSection } from '@impeo/ice-core';

@Component({
  selector: 'insis-dialog-section-container',
  templateUrl: 'insis-dialog-section-container.html',
})
export class InsisDialogSectionContainer {
  sections: IceSection[] = new Array<IceSection>();

  constructor(
    public dialogRef: MatDialogRef<InsisDialogSectionContainer>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    const sections: any[] = data['sections'];
    sections.forEach((section) => {
      this.sections.push(IceSection.build(data.page, data.page, section));
      (data.page as IcePage).sections.pop();
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
