import { Component, inject, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IModalComponent } from '@app-core/models/editor-component';

@Component({
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.scss'],
})
export class FormDialogComponent implements IModalComponent {
  form: FormGroup;
  dialogRef: MatDialogRef<FormDialogComponent> = inject(
    MatDialogRef<FormDialogComponent>
  );

  fb: FormBuilder = inject(FormBuilder);
  constructor(@Inject(MAT_DIALOG_DATA) public data: IModalData) {
    this.form = this.fb.group({
      selectedItems: [[]],
    });
  }

  save() {
    if (this.form.valid) {
      this.dialogRef.close({
        selectedItems: this.form.value.selectedItems,
        continue: true,
      });
    }
  }

  close() {
    this.dialogRef.close({
      continue: false,
    });
  }
}

interface IModalData {
  title: string;
  description: string;
  label: string;
  items: string[];
}

export interface FormDialogResult {
  selectedItems: string[];
  continue: boolean;
}
