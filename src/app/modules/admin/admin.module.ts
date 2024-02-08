import { NgModule } from '@angular/core';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminShellComponent } from './admin-shell/admin-shell.component';
import { ScoresViewComponent } from './scores-view/scores-view.component';
import { SharedModule } from '@app-shared/shared.module';
import { MaterialModule } from '@app-material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ScoreFillerComponent } from './score-filler/score-filler.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { StandingsViewComponent } from './standings-view/standings-view.component';
import { HourPipe } from '@app-shared/pipes/hour.pipe';
import { AdminOperationsViewComponent } from './admin-operations-view/admin-operations-view.component';


@NgModule({
  declarations: [
    AdminShellComponent,
    ScoresViewComponent,
    ScoreFillerComponent,
    StandingsViewComponent,
    AdminOperationsViewComponent,    
  ],
  imports: [
    AdminRoutingModule,
    FlexLayoutModule,    
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MaterialModule,
    NgxMatTimepickerModule    
  ],
  providers: [HourPipe]
})
export class AdminModule { }
