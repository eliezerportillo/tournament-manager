import { Component, Input } from '@angular/core';
import { LineUp } from '@app-core/models/lineup';
import { IPlayer } from '@app-core/models/player';
import { Team } from '@app-core/models/team';

@Component({
  selector: 'app-starting-player',
  templateUrl: './starting-player.component.html',
  styleUrls: ['./starting-player.component.scss']
})
export class StartingPlayerComponent {

  @Input()
  home: boolean;

  playerImageUrl: string;
  _player!: LineUp;

  @Input()
  set player(value: LineUp | undefined) {
    if (value === undefined) return;
    this.playerImageUrl = Team.createImageUrl(value.equipo);
    this._player = value;
  }

  get player() {
    return this._player;
  }

  constructor() {
    this.home = true;
    this.playerImageUrl = '';
  }


}
