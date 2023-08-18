import { NgModule } from '@angular/core';
import { FormationPickerComponent } from './formation-picker/formation-picker.component';
import { MatchComponent } from './match/match.component';
import { MatchHourComponent } from './match-hour/match-hour.component';
import { MatchListComponent } from './match-list/match-list.component';
import { SharedModule } from '../shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FirebaseModule } from '../firebase/firebase.module';
import { LineupViewerComponent } from './lineups/lineup-viewer/lineup-viewer.component';
import { LineupComponent } from './lineups/lineup/lineup.component';
import { UploadLineupComponent } from './lineups/upload-lineup/upload-lineup.component';
import { MatchesRoutingModule } from './matches-routing.module';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PlayerNameComponent } from './players/player-name/player-name.component';
import { ListSelectorComponent } from './players/list-selector/list-selector.component';
import { PlayerPickerComponent } from './players/player-picker/player-picker.component';
import { StartingPlayerComponent } from './players/starting-player/starting-player.component';
import { PlayerListComponent } from './players/player-list/player-list.component';



@NgModule({
  declarations: [
    FormationPickerComponent,    
    LineupViewerComponent,
    MatchComponent,
    MatchHourComponent,
    MatchListComponent,    
    LineupComponent,
    LineupViewerComponent,
    UploadLineupComponent,
    PlayerNameComponent,
    ListSelectorComponent,
    PlayerPickerComponent,
    StartingPlayerComponent,
    PlayerListComponent
  ],
  imports: [
    MatchesRoutingModule,
    SharedModule,
    FlexLayoutModule,
    FirebaseModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class MatchesModule { }
