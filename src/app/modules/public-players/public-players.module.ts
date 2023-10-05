import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicPlayersRoutingModule } from './public-players-routing.module';
import { PlayerPhotoCaptureViewComponent } from './player-photo-capture-view/player-photo-capture-view.component';
import { WebcamModule } from 'ngx-webcam';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';

import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImageCropperModule } from 'ngx-image-cropper';

@NgModule({
  declarations: [
    PlayerPhotoCaptureViewComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatStepperModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    PublicPlayersRoutingModule,
    ImageCropperModule,
    WebcamModule
  ]
})
export class PublicPlayersModule { }
