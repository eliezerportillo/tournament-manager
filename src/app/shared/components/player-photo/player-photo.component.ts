import { Component, Input, OnInit, inject } from '@angular/core';
import { IBadge } from '@app-core/models/bagde';
import { IPlayer } from '@app-core/models/player';
import { PlayerService } from '@app-core/services/player.service';

@Component({
  selector: 'app-player-photo',
  templateUrl: './player-photo.component.html',
  styleUrls: ['./player-photo.component.scss']
})
export class PlayerPhotoComponent implements OnInit {

  playerService = inject(PlayerService);
  private _player!: IPlayer
  badge?: IBadge | null;

  @Input()
  set player(value: IPlayer) {
    this._player = value;
    this.getPlayer(value);
  }

  get player() {
    return this._player;
  }

  @Input() size: 'small' | 'medium' | 'large' = 'small';

  ngOnInit(): void {
  }

  async getPlayer(player: IPlayer) {
    this.badge = await this.playerService.getBadge(player)
  }
}
