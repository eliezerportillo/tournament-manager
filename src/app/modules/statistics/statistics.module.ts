import { NgModule } from '@angular/core';

import { StatisticsRoutingModule } from './statistics-routing.module';
import { StatsComponent } from './stats/stats.component';
import { StatsListComponent } from './stats-list/stats-list.component';
import { SharedModule } from '@app-shared/shared.module';
import { MaterialModule } from '@app-material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';


@NgModule({
  declarations: [ 
    StatsComponent,
    StatsListComponent
  ],
  imports: [    
    StatisticsRoutingModule,
    SharedModule,
    MaterialModule,
    FlexLayoutModule
  ]
})
export class StatisticsModule { }
