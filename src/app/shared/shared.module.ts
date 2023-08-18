import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogoComponent } from './logo/logo.component';
import { DateStatusPipe } from './pipes/date-status.pipe';
import { ShortNamePipe } from './pipes/short-name.pipe';
import { NavComponent } from './nav/nav.component';
import { MaterialModule } from '../material/material.module';
import { MatchResultIconComponent } from './components/match-result-icon/match-result-icon.component';
import { LastMatchesComponent } from './components/last-matches/last-matches.component';
import { TeamImageComponent } from './components/team-image/team-image.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    LogoComponent,
    ShortNamePipe,
    DateStatusPipe,
    NavComponent,
    MatchResultIconComponent,
    LastMatchesComponent,
    TeamImageComponent,
    
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MaterialModule,
    RouterModule
  ],
  exports: [
    CommonModule,
    LogoComponent,
    ShortNamePipe,
    DateStatusPipe,
    NavComponent,
    MatchResultIconComponent,
    LastMatchesComponent,
    TeamImageComponent,

  ]
})
export class SharedModule { }
