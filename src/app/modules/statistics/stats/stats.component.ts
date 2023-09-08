import { Component, OnInit } from '@angular/core';
import { Stats } from '@app-core/models/stats';
import { PlayerService } from '@app-core/services/player.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {
  constructor(private playerService: PlayerService) {
    
  }
  
  stats?: Stats;

  get goals() {
    return this.stats && this.stats.goals && this.stats.goals ? this.stats.goals : [];
  }

  get yellows() {
    return this.stats && this.stats.yellows && this.stats.yellows ? this.stats.yellows : [];
  }

  get reds() {
    return this.stats && this.stats.reds && this.stats.reds ? this.stats.reds : [];
  }

  ngOnInit(): void {
    this.getStats();
  }



  private async getStats() {
    this.stats = await this.playerService.getPlayersStats();
  }
}
