import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeamPhotoCaptureRoutingModule } from './team-photo-capture-routing.module';
import { TeamPhotoCaptureViewComponent } from './team-photo-capture-view/team-photo-capture-view.component';
import { MaterialModule } from '@app-material/material.module';
import { WebcamModule } from 'ngx-webcam';
import { GoogleMapsModule } from '@angular/google-maps';
import { SharedModule } from '@app-shared/shared.module';

@NgModule({
  declarations: [TeamPhotoCaptureViewComponent],
  imports: [
    CommonModule,
    MaterialModule,
    TeamPhotoCaptureRoutingModule,
    WebcamModule,
    GoogleMapsModule,
    SharedModule,
  ],
})
export class TeamPhotoCaptureModule {}
