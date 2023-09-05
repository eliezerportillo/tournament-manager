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
import { StandingsViewComponent } from './standings-view/standings-view.component';
import { HourPipe } from '../shared/pipes/hour.pipe';
import { SponsorsViewComponent } from './sponsors/sponsors-view/sponsors-view.component';
import { SponsorCreateComponent } from './sponsors/sponsor-create/sponsor-create.component';
import { UploadComponent } from './upload/upload.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { HammerModule } from '@angular/platform-browser';

@NgModule({
  declarations: [
    AdminShellComponent,
    ScoresViewComponent,
    ScoreFillerComponent,
    StandingsViewComponent,
    SponsorsViewComponent,
    SponsorCreateComponent,
    UploadComponent,
  ],
  imports: [
    FlexLayoutModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MaterialModule,
    AdminRoutingModule,
    NgxMatTimepickerModule,
    HammerModule,
    ImageCropperModule
  ],
  providers: [HourPipe]
})
export class AdminModule { }
