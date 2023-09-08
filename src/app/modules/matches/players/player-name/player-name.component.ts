import { Component, Input } from '@angular/core';
import { Player } from '@app-core/models/player';

@Component({
  selector: 'app-player-name',
  templateUrl: './player-name.component.html',
  styleUrls: ['./player-name.component.scss']
})
export class PlayerNameComponent {
  @Input()
  player?: Player;

  @Input()
  shortName?: boolean;

}
