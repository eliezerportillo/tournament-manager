import { NgModule } from '@angular/core';

import { StatisticsRoutingModule } from './statistics-routing.module';
import { StatsComponent } from './stats/stats.component';
import { StatsListComponent } from './stats-list/stats-list.component';
import { SharedModule } from '../../shared/shared.module';
import { MaterialModule } from '../../material/material.module';
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
