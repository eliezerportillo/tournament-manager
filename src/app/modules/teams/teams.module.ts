import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeamsRoutingModule } from './teams-routing.module';
import { TeamViewComponent } from './team-view/team-view.component';


@NgModule({
  declarations: [
    TeamViewComponent
  ],
  imports: [
    CommonModule,
    TeamsRoutingModule
  ]
})
export class TeamsModule { }
