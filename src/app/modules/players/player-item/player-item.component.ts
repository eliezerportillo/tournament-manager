import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IPlayer } from '@app-core/models/player';

@Component({
  selector: 'app-player-item',
  templateUrl: './player-item.component.html',
  styleUrls: ['./player-item.component.scss']
})
export class PlayerItemComponent {

  @Input()
  player?: IPlayer;

  @Output()
  selected: EventEmitter<IPlayer> = new EventEmitter<IPlayer>();

  select(event: IPlayer) {
    this.selected.emit(event);
  }
}
