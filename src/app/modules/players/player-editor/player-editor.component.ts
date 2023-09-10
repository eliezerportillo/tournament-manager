import { Component, Inject, inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { IEditorComponent } from '@app-core/models/editor-component';
import { Player } from '@app-core/models/player';

@Component({
  selector: 'app-player-editor',
  templateUrl: './player-editor.component.html',
  styleUrls: ['./player-editor.component.scss']
})
export class PlayerEditorComponent implements IEditorComponent {

  bottomSheetRef = inject(MatBottomSheetRef<PlayerEditorComponent>);

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: Player) {

  }

  close(): void {
    this.bottomSheetRef.dismiss();
  }


}
