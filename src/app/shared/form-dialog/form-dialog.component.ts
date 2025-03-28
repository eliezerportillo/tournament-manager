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
      selectedItems: [[], this.data.required ? Validators.required : []],
    });
  }

  save() {
    if (this.form.valid) {
      const result: FormDialogResult = {
        selection: this.form.value.selectedItems,
        success: true,
      };
      this.dialogRef.close(result);
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
  multiple: boolean;
  required: boolean;
  buttons: string[];
  canCancel: boolean;
}

export interface FormDialogResult {
  selection: string[] | string;
  success: boolean;
}
