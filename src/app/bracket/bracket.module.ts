import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BracketRoutingModule } from './bracket-routing.module';
import { BracketViewComponent } from './bracket-view/bracket-view.component';


@NgModule({
  declarations: [
    BracketViewComponent
  ],
  imports: [
    CommonModule,
    BracketRoutingModule
  ]
})
export class BracketModule { }
