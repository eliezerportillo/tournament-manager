import { Component, Input } from '@angular/core';
import { IPlayer } from '@app-core/models/player';

@Component({
  selector: 'app-stats-list',
  templateUrl: './stats-list.component.html',
  styleUrls: ['./stats-list.component.scss']
})
export class StatsListComponent {
  constructor() {
    this.statName = '';
    this._players = [];
  }

  _players: IPlayer[];

  @Input()
  name?: string;

  @Input()
  statName: string;

  @Input()
  set players(value: IPlayer[]) {
    this._players = value.sort((a, b) => this.getStatValue(b) - this.getStatValue(a));
  } 

  get players(): IPlayer[] {
    return this._players;
  }



  getStatValue(player: IPlayer) {
    return (player as any)[this.statName];
  }



}
