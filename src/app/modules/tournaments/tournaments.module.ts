import { NgModule } from '@angular/core';


import { TournamentsRoutingModule } from './tournaments-routing.module';
import { TournamentComponent } from './tournament/tournament.component';
import { MaterialModule } from '@app-material/material.module';
import { SharedModule } from '@app-shared/shared.module';


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
