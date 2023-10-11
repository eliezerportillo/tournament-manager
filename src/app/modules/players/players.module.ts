import { NgModule } from '@angular/core';


import { PlayersRoutingModule } from '@app-modules/players/players-routing.module';
import { PlayersViewComponent } from '@app-modules/players/players-view/players-view.component';
import { PlayerItemComponent } from '@app-modules/players/player-item/player-item.component';
import { MaterialModule } from '@app-material/material.module';
import { SharedModule } from '@app-shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PlayerEditorComponent } from './player-editor/player-editor.component';
import { CredentialListComponent } from './credential-list/credential-list.component';
import { BadgeItemComponent } from './badge-item/badge-item.component';


@NgModule({
  declarations: [
    PlayersViewComponent,
    PlayerItemComponent,
    PlayerEditorComponent,
    CredentialListComponent,
    BadgeItemComponent
  ],
  imports: [
    PlayersRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    FlexLayoutModule
  ]
})
export class PlayersModule { }
