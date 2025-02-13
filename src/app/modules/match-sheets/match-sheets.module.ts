import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatchSheetsRoutingModule } from './match-sheets-routing.module';
import { MatchSheetViewComponent } from './match-sheet-view/match-sheet-view.component';

import { MaterialModule } from '@app-material/material.module';
import { SharedModule } from '@app-shared/shared.module';
import { SheetComponent } from './sheet/sheet.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatchSheetPlayerListComponent } from './match-sheet-player-list/match-sheet-player-list.component';
import { PlayerCardReaderComponent } from '@app-shared/components/player-card-reader/player-card-reader.component';

@NgModule({
  declarations: [
    MatchSheetViewComponent,
    SheetComponent,
    MatchSheetPlayerListComponent,
  ],
  imports: [
    SharedModule,
    FlexLayoutModule,
    MaterialModule,
    MatchSheetsRoutingModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatSidenavModule,
    PlayerCardReaderComponent,
  ],
})
export class MatchSheetsModule {}
