import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { LogoComponent } from '@app-shared/logo/logo.component';
import { DateStatusPipe } from '@app-shared/pipes/date-status.pipe';
import { ShortNamePipe } from '@app-shared/pipes/short-name.pipe';
import { NavComponent } from '@app-shared/nav/nav.component';
import { MaterialModule } from '@app-material/material.module';
import { MatchResultIconComponent } from '@app-shared/components/match-result-icon/match-result-icon.component';
import { LastMatchesComponent } from '@app-shared/components/last-matches/last-matches.component';
import { TeamImageComponent } from '@app-shared/components/team-image/team-image.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { MatchListComponent } from '@app-shared/components/match-list/match-list.component';
import { MatchComponent } from '@app-shared/components/match/match.component';
import { MatchHourComponent } from '@app-shared/components/match-hour/match-hour.component';
import { CompanyNameComponent } from '@app-shared/components/company-name/company-name.component';
import { MatchHeaderComponent } from '@app-shared/components/match-header/match-header.component';
import { TeamListComponent } from '@app-shared/components/team-list/team-list.component';
import { HourPipe } from '@app-shared/pipes/hour.pipe';
import { ExcelDatePipe } from '@app-shared/pipes/excel-date.pipe';
import { SponsorsBannerComponent } from '@app-shared/components/sponsors-banner/sponsors-banner.component';
import { UploadComponent } from '@app-shared/components/upload/upload.component';
import { ConfirmationDialogComponent } from '@app-shared/confirmation-dialog/confirmation-dialog.component';
import { NumberInputComponent } from '@app-shared/number-input/number-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeleteButtonComponent } from '@app-shared/components/delete-button/delete-button.component';
import { BatchCreatorComponent } from './components/batch-creator/batch-creator.component';




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
    BatchCreatorComponent,
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
    DeleteButtonComponent,
    BatchCreatorComponent
  ],
  providers: [DatePipe]
})
export class SharedModule { }
