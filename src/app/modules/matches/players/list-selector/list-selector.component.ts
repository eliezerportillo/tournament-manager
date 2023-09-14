import { Component, Inject,  inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';

import { IPlayer } from '@app-core/models/player';
import { PlayerService } from '@app-core/services/player.service';


@Component({
  selector: 'app-list-selector',
  templateUrl: './list-selector.component.html',
  styleUrls: ['./list-selector.component.scss']
})
export class ListSelectorComponent {

  bottomSheetRef: MatBottomSheetRef<ListSelectorComponent> = inject(MatBottomSheetRef<ListSelectorComponent>);
  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: {players: IPlayer[] }) { 
    this.players = data.players;
    this.message = `Elegir jugador`;
  }
  playerService: PlayerService = inject(PlayerService);
  players: IPlayer[];
  message: string;


  

  openLink(player: IPlayer): void {
    this.bottomSheetRef.dismiss(player);
  }
}
