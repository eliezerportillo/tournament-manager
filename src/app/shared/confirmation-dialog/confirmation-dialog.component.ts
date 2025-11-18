import {
  Component,
  Input,
  Output,
  EventEmitter,
  inject,
  Inject,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface ConfirmationDialogData {
  message: string;
  title?: string;
  confirmButtonText?: string;
  confirmButtonColor?: 'primary' | 'accent' | 'warn';
  cancelButtonText?: string;
  showTextArea?: boolean;
  textAreaPlaceholder?: string;
  textAreaRequired?: boolean;
}

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss'],
})
export class ConfirmationDialogComponent {
  dialogRef: MatDialogRef<ConfirmationDialogComponent> = inject(
    MatDialogRef<ConfirmationDialogComponent>
  );
  @Input() message?: string;
  @Output() confirmAction = new EventEmitter<void>();
  @Output() cancelAction = new EventEmitter<void>();

  textValue: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData) {
    this.message = data.message;
  }

  confirm() {
    if (this.data.showTextArea) {
      // Return object with confirmation and text value
      this.dialogRef.close({
        confirmed: true,
        textValue: this.textValue,
      });
    } else {
      // Legacy behavior - just return boolean
      this.dialogRef.close(true);
    }
  }

  cancel() {
    this.dialogRef.close(false);
  }

  isConfirmDisabled(): boolean {
    return !!(
      this.data.showTextArea &&
      this.data.textAreaRequired &&
      !this.textValue.trim()
    );
  }
}
