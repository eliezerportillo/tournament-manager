import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeamPhotoCaptureRoutingModule } from './team-photo-capture-routing.module';
import { TeamPhotoCaptureViewComponent } from './team-photo-capture-view/team-photo-capture-view.component';
import { MaterialModule } from '@app-material/material.module';
import { WebcamModule } from 'ngx-webcam';

@NgModule({
  declarations: [TeamPhotoCaptureViewComponent],
  imports: [
    CommonModule,
    MaterialModule,
    TeamPhotoCaptureRoutingModule,
    WebcamModule,
  ],
})
export class TeamPhotoCaptureModule {}
