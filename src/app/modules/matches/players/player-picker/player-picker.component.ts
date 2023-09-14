import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IPlayer, PlayerType } from '@app-core/models/player';
import { LineUp } from '@app-core/models/lineup';

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
  selectedPlayers?: IPlayer[] = [];

  @Output()
  selectedPlayer = new EventEmitter<IPlayer>();

  
}


