import { NgModule } from '@angular/core';


import { TournamentsRoutingModule } from './tournaments-routing.module';
import { TournamentComponent } from './tournament/tournament.component';
import { MaterialModule } from '../../material/material.module';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    TournamentComponent
  ],
  imports: [        
    TournamentsRoutingModule,
    MaterialModule,
    SharedModule
  ]
})
export class TournamentsModule { }
