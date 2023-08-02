import { Component, Input } from '@angular/core';
import { Player } from 'src/app/models/player';

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

  _players: Player[];

  @Input()
  name?: string;

  @Input()
  set players(value: Player[]) {
    this._players = value.sort((a, b) => this.getStatValue(b) - this.getStatValue(a));
  }

  @Input()
  statName: string;

  get players(): Player[] {
    return this._players;
  }

  getStatValue(player: Player) {
    return (player as any)[this.statName];
  }



}
