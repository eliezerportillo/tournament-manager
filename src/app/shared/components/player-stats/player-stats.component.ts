import { Component, Input } from '@angular/core';
import { IPlayer } from '@app-core/models/player';

@Component({
  selector: 'app-player-stats',
  templateUrl: './player-stats.component.html',
  styleUrls: ['./player-stats.component.scss'],
})
export class PlayerStatsComponent {
  @Input() player?: IPlayer;
  @Input() showCount = false;
}
