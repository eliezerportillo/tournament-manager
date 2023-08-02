import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';




import { AngularFireModule, FIREBASE_OPTIONS } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { ImportExcelComponent } from './import-excel/import-excel.component';
import { ShellComponent } from './shell/shell.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TournamentComponent } from './routed/tournament/tournament.component';
import { MatchComponent } from './matches/match/match.component';
import { MatchListComponent } from './matches/match-list/match-list.component';

import { registerLocaleData } from '@angular/common';
import localeEsMx from '@angular/common/locales/es-MX'
import { FlexLayoutModule } from '@angular/flex-layout';
import { RankingComponent } from './standings/ranking/ranking.component';
import { TeamImageComponent } from './teams/team-image/team-image.component';
import { LineupComponent } from './routed/matches/lineup/lineup.component';
import { MatchHourComponent } from './matches/match-hour/match-hour.component';
import { ShortNamePipe } from './pipes/short-name.pipe';
import { PlayerNameComponent } from './players/player-name/player-name.component';
import { LastMatchesComponent } from './matches/last-matches/last-matches.component';
import { MatchResultIconComponent } from './matches/match-result-icon/match-result-icon.component';
import { StatsComponent } from './players/stats/stats.component';
import { StatsListComponent } from './players/stats-list/stats-list.component';

registerLocaleData(localeEsMx, 'es-MX');

@NgModule({
  declarations: [
    AppComponent,
    ImportExcelComponent,
    ShellComponent,
    TournamentComponent,
    MatchComponent,
    MatchListComponent,
    RankingComponent,
    TeamImageComponent,
    LineupComponent,
    MatchHourComponent,
    ShortNamePipe,
    PlayerNameComponent,
    LastMatchesComponent,
    MatchResultIconComponent,
    StatsComponent,    
    StatsListComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    MatToolbarModule,
    MatIconModule,
    MatProgressBarModule,
    BrowserAnimationsModule,
    MatTabsModule,
    FlexLayoutModule,
    MatSnackBarModule,
    MatTableModule,
    MatCardModule,
    MatRippleModule,
    MatButtonModule,
    MatListModule
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'es-MX' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
