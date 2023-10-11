import { Injectable, inject } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { IModalComponent } from '@app-core/models/editor-component';
import { ConfirmationDialogComponent } from '@app-shared/confirmation-dialog/confirmation-dialog.component';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  modal = inject(MatDialog);
  bottomSheet = inject(MatBottomSheet)
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


  open<ComponentType extends IModalComponent, TData>(component: new (...args: any[]) => ComponentType, data?: TData): Observable<any> {
    const bottomSheetRef = this.bottomSheet.open(component, { data, disableClose: true });

    return bottomSheetRef.afterDismissed();
  }
}

interface ModalConfig {
  message: string;
}
