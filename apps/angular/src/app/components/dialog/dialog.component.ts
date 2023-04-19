import { Component, ViewChild, TemplateRef, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';

type DialogSize = 'small' | 'medium' | 'large' | 'xlarge';

@Component({
  selector: 'app-dialog',
  template: `
    <ng-template #myTemplate>
      <ng-content></ng-content>
    </ng-template>
  `,
})
export class AppDialog {
  @ViewChild('myTemplate') customTemplate: TemplateRef<any>;

  dialogRef: any;

  @Input() size: DialogSize = 'medium';

  @Input() config: MatDialogConfig = {};

  @Input() set visible(value: boolean) {
    if (value) {
      Promise.resolve().then(() => {
        this.dialogRef = this.dialog.open(this.customTemplate, {
          width: this.getWidth() + 'px',
          ...this.config,
        });

        this.dialogRef.afterClosed().subscribe((result) => {
          this.visibleChange.emit(false);
        });
      });
    } else if (!value && this.dialogRef) {
      this.dialogRef.close();
    }
  }

  @Output() visibleChange: EventEmitter<any> = new EventEmitter();

  constructor(public dialog: MatDialog) {}

  getWidth() {
    switch (this.size) {
      case 'small':
        return 288;
      case 'medium':
        return 576;
      case 'large':
        return 864;
      case 'xlarge':
        return 1152;
    }
  }
}
