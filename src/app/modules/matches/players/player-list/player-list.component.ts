import { Component, Input } from '@angular/core';
import { Player } from '@app-core/models/player';

@Component({
  selector: 'app-player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.scss']
})
export class PlayerListComponent {
  @Input()
  players?: Player[];
}
