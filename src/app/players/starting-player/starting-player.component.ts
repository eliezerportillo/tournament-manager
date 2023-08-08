import { Component, Input } from '@angular/core';
import { Player } from 'src/app/models/player';
import { Team } from 'src/app/models/team';

@Component({
  selector: 'app-starting-player',
  templateUrl: './starting-player.component.html',
  styleUrls: ['./starting-player.component.scss']
})
export class StartingPlayerComponent {

  @Input()
  home: boolean;

  playerImageUrl: string;
  _player!: Player;

  @Input()
  set player(value: Player | undefined) {
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
