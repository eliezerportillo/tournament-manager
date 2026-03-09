import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';

import { TeamsRoutingModule } from './teams-routing.module';
import { TeamViewComponent } from './team-view/team-view.component';
import { PendingPlayersListComponent } from './pending-players-list/pending-players-list.component';
import { PendingPlayerDetailComponent } from './pending-player-detail/pending-player-detail.component';
import { PlayerFormComponent } from './player-form/player-form.component';
import { MaterialModule } from '@app-material/material.module';
import { PlayersModule } from '@app-modules/players/players.module';
import { SharedModule } from '@app-shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [
    TeamViewComponent,
    PendingPlayersListComponent,
    PendingPlayerDetailComponent,
    PlayerFormComponent,
  ],
  imports: [
    CommonModule,
    TeamsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    PlayersModule,
    SharedModule,
    FlexLayoutModule,
  ],
})
export class TeamsModule {}
