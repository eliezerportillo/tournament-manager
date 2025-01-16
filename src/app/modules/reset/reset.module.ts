import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResetRoutingModule } from './reset-routing.module';
import { CleanTournamentComponent } from './clean-tournament/clean-tournament.component';


@NgModule({
  declarations: [
    CleanTournamentComponent
  ],
  imports: [
    CommonModule,
    ResetRoutingModule
  ]
})
export class ResetModule { }
