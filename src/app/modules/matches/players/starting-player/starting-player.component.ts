import { Component, Input, OnInit, inject } from '@angular/core';
import { LineUp } from '@app-core/models/lineup';
import { IPlayer } from '@app-core/models/player';
import { Team } from '@app-core/models/team';
import { TeamService } from '@app-core/services/team.service';

@Component({
  selector: 'app-starting-player',
  templateUrl: './starting-player.component.html',
  styleUrls: ['./starting-player.component.scss']
})
export class StartingPlayerComponent {

  @Input()
  home: boolean;

  @Input()
  playerImageUrl: string;
  
  _player!: LineUp;

  playerModel!: IPlayer;

  @Input()
  set player(value: LineUp | undefined) {
    if (value === undefined) return;
    this._player = value;
    this.playerModel = (value as unknown) as IPlayer
  }

  get player() {
    return this._player;
  }

  constructor() {
    this.home = true;
    this.playerImageUrl = '';
  }




}
