import { NgModule } from '@angular/core';
import { FormationPickerComponent } from './formation-picker/formation-picker.component';
import { MatchesViewComponent } from './matches-view/matches-view.component';
import { SharedModule } from '@app-shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FirebaseModule } from '../../firebase/firebase.module';
import { LineupViewerComponent } from './lineups/lineup-viewer/lineup-viewer.component';
import { LineupComponent } from './lineups/lineup/lineup.component';
import { UploadLineupComponent } from './lineups/upload-lineup/upload-lineup.component';
import { MatchesRoutingModule } from './matches-routing.module';
import { MaterialModule } from '@app-material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PlayerNameComponent } from './players/player-name/player-name.component';
import { ListSelectorComponent } from './players/list-selector/list-selector.component';
import { PlayerPickerComponent } from './players/player-picker/player-picker.component';
import { StartingPlayerComponent } from './players/starting-player/starting-player.component';
import { PlayerListComponent } from './players/player-list/player-list.component';
import { MatchTableInfoComponent } from '@app-shared/components/match-table-info/match-table-info.component';

@NgModule({
  declarations: [
    FormationPickerComponent,
    LineupViewerComponent,
    MatchesViewComponent,
    LineupComponent,
    LineupViewerComponent,
    UploadLineupComponent,
    PlayerNameComponent,
    ListSelectorComponent,
    PlayerPickerComponent,
    StartingPlayerComponent,
    PlayerListComponent,
  ],
  imports: [
    MatchesRoutingModule,
    SharedModule,
    FlexLayoutModule,
    FirebaseModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatchTableInfoComponent,
  ],
})
export class MatchesModule {}
