import { Component, Inject, inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { IModalComponent } from '@app-core/models/editor-component';

@Component({
  selector: 'app-error-handler-modal',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatToolbarModule],
  templateUrl: './error-handler-modal.component.html',
  styleUrls: ['./error-handler-modal.component.scss']
})
export class ErrorHandlerModalComponent implements IModalComponent {
  bottomSheetRef: MatBottomSheetRef<ErrorHandlerModalComponent> = inject(MatBottomSheetRef<ErrorHandlerModalComponent>);
  
  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: any) { }

  close(): void {
    this.bottomSheetRef.dismiss();
  }
}
