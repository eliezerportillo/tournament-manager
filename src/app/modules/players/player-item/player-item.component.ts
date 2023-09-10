import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Player } from '@app-core/models/player';

@Component({
  selector: 'app-player-item',
  templateUrl: './player-item.component.html',
  styleUrls: ['./player-item.component.scss']
})
export class PlayerItemComponent {

  @Input()
  player?: Player;

  @Output()
  selected: EventEmitter<Player> = new EventEmitter<Player>();

  select(event: Player) {
    this.selected.emit(event);
  }
}
