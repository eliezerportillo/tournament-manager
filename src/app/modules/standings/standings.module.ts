import { NgModule } from '@angular/core';
import { StandingsRoutingModule } from './standings-routing.module';
import { RankingComponent } from './ranking/ranking.component';
import { MaterialModule } from '@app-material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '@app-shared/shared.module';


@NgModule({
  declarations: [
    RankingComponent
  ],
  imports: [    
    StandingsRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    SharedModule
  ]
})
export class StandingsModule { }
