import { Component, Input } from '@angular/core';
import { INamedObject } from '@app-core/models/named.object';
import { IPlayer } from '@app-core/models/player';

@Component({
  selector: 'app-player-name',
  templateUrl: './player-name.component.html',
  styleUrls: ['./player-name.component.scss']
})
export class PlayerNameComponent {
  @Input()
  player?: IPlayer;

  @Input()
  shortName?: boolean;

}
