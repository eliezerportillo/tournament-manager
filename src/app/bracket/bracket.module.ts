import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BracketRoutingModule } from './bracket-routing.module';
import { BracketViewComponent } from './bracket-view/bracket-view.component';
import { SharedModule } from '../shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';


@NgModule({
  declarations: [
    BracketViewComponent
  ],
  imports: [
    SharedModule,
    FlexLayoutModule,
    BracketRoutingModule
  ]
})
export class BracketModule { }
