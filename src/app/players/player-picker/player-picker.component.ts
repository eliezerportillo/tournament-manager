import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Player, PlayerType } from 'src/app/models/player';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ListSelectorComponent } from '../list-selector/list-selector.component';
import { firstValueFrom } from 'rxjs';
import { LineUp } from 'src/app/models/lineup';

@Component({
  selector: 'app-player-picker',
  templateUrl: './player-picker.component.html',
  styleUrls: ['./player-picker.component.scss']
})
export class PlayerPickerComponent {
  

  @Input()
  player?: LineUp;

  @Input()
  playerType?: PlayerType = PlayerType.defensa;

  @Input()
  selectedPlayers?: Player[] = [];

  @Output()
  selectedPlayer = new EventEmitter<Player>();

  
}


