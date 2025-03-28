import { Component, OnInit } from '@angular/core';
import { Stats } from '@app-core/models/stats';
import { PlayerService } from '@app-core/services/player.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
})
export class StatsComponent implements OnInit {
  constructor(private playerService: PlayerService) {}

  stats?: Stats;

  get assists() {
    return this.stats && this.stats.assists && this.stats.assists
      ? this.stats.assists
      : [];
  }

  get goals() {
    return this.stats && this.stats.goals && this.stats.goals
      ? this.stats.goals
      : [];
  }

  get yellows() {
    return this.stats && this.stats.yellows && this.stats.yellows
      ? this.stats.yellows
      : [];
  }

  get reds() {
    return this.stats && this.stats.reds && this.stats.reds
      ? this.stats.reds
      : [];
  }

  get faults() {
    return this.stats && this.stats.faults && this.stats.faults
      ? this.stats.faults
      : [];
  }

  ngOnInit(): void {
    this.getStats();
  }

  private async getStats() {
    this.stats = await this.playerService.getPlayersStats();
  }
}
