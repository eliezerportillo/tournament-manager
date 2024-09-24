import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WidgetsRoutingModule } from './widgets-routing.module';
import { SharedModule } from '@app-shared/shared.module';
import { SponsorsWidgetComponent } from './sponsors-widget/sponsors-widget.component';


@NgModule({
  declarations: [
    SponsorsWidgetComponent
  ],
  imports: [    
    SharedModule,
    WidgetsRoutingModule
  ]
})
export class WidgetsModule { }
