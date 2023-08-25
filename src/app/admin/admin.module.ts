import { NgModule } from '@angular/core';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminShellComponent } from './admin-shell/admin-shell.component';
import { ScoresViewComponent } from './scores-view/scores-view.component';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ScoreFillerComponent } from './score-filler/score-filler.component';
import { MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';

@NgModule({
  declarations: [
    AdminShellComponent,
    ScoresViewComponent,
    ScoreFillerComponent
  ],
  imports: [
    FlexLayoutModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MaterialModule,
    AdminRoutingModule,
    NgxMatTimepickerModule
  ]
})
export class AdminModule { }
