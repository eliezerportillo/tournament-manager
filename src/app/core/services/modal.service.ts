import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '@app-shared/confirmation-dialog/confirmation-dialog.component';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  modal = inject(MatDialog);
  constructor() { }

  confirm(config: string): Observable<boolean | undefined>;
  confirm(config: ModalConfig): Observable<boolean | undefined>;
  confirm(config: string | ModalConfig): Observable<boolean | undefined> {
    let modalConfig: ModalConfig;
    if (typeof config === 'string') {
      modalConfig = { message: config };
    } else {
      modalConfig = config;
    }

    const dialogRef = this.modal.open<ConfirmationDialogComponent, ModalConfig, boolean>(ConfirmationDialogComponent, {
      data: modalConfig
    });

    return dialogRef.afterClosed();

  }
}

interface ModalConfig {
  message: string;
}
