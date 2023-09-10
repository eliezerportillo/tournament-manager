import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
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
import { MatchListComponent } from './components/match-list/match-list.component';
import { MatchComponent } from './components/match/match.component';
import { MatchHourComponent } from './components/match-hour/match-hour.component';
import { CompanyNameComponent } from './components/company-name/company-name.component';
import { MatchHeaderComponent } from './components/match-header/match-header.component';
import { TeamListComponent } from './components/team-list/team-list.component';
import { HourPipe } from './pipes/hour.pipe';
import { ExcelDatePipe } from './pipes/excel-date.pipe';
import { SponsorsBannerComponent } from './components/sponsors-banner/sponsors-banner.component';
import { UploadComponent } from './components/upload/upload.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { NumberInputComponent } from './number-input/number-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeleteButtonComponent } from './components/delete-button/delete-button.component';




@NgModule({
  declarations: [
    LogoComponent,
    ShortNamePipe,
    DateStatusPipe,
    NavComponent,
    MatchResultIconComponent,
    LastMatchesComponent,
    TeamImageComponent,
    MatchListComponent,
    MatchComponent,
    MatchHourComponent,
    MatchListComponent,
    CompanyNameComponent,
    MatchHeaderComponent,
    TeamListComponent,
    HourPipe,
    ExcelDatePipe,
    SponsorsBannerComponent,
    UploadComponent,
    ConfirmationDialogComponent,
    NumberInputComponent,
    DeleteButtonComponent,
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MaterialModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
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
    MatchComponent,
    MatchHourComponent,
    MatchListComponent,
    CompanyNameComponent,
    MatchHeaderComponent,
    TeamListComponent,
    HourPipe,
    ExcelDatePipe,
    SponsorsBannerComponent,
    UploadComponent,
    ConfirmationDialogComponent,
    NumberInputComponent,
    DeleteButtonComponent
  ],
  providers: [DatePipe]
})
export class SharedModule { }
