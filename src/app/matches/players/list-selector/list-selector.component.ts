import { Component, Inject, OnInit, inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Observable, from } from 'rxjs';
import { Player, PlayerType } from 'src/app/models/player';
import { PlayerService } from 'src/app/services/player.service';
import { filter } from 'rxjs/operators';
import { LineUp } from 'src/app/models/lineup';

@Component({
  selector: 'app-list-selector',
  templateUrl: './list-selector.component.html',
  styleUrls: ['./list-selector.component.scss']
})
export class ListSelectorComponent {

  bottomSheetRef: MatBottomSheetRef<ListSelectorComponent> = inject(MatBottomSheetRef<ListSelectorComponent>);
  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: {players: Player[] }) { 
    this.players = data.players;
    this.message = `Elegir jugador`;
  }
  playerService: PlayerService = inject(PlayerService);
  players: Player[];
  message: string;


  

  openLink(player: Player): void {
    this.bottomSheetRef.dismiss(player);
  }
}
