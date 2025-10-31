import { Component, Input, OnInit, inject } from '@angular/core';
import { LineUp } from '@app-core/models/lineup';
import { IPlayer } from '@app-core/models/player';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-starting-player',
  templateUrl: './starting-player.component.html',
  styleUrls: ['./starting-player.component.scss'],
  animations: [
    trigger('bounce', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)' }),
        animate(
          '600ms cubic-bezier(0.25, 1.25, 0.5, 1)',
          style({ transform: 'translateY(0)' })
        ),
      ]),
    ]),
  ],
})
export class StartingPlayerComponent {
  @Input()
  home: boolean;

  @Input()
  playerImageUrl: string;

  _player!: LineUp;

  playerModel!: IPlayer;
  showImage: boolean = false;

  @Input()
  set player(value: LineUp | undefined) {
    if (value === undefined) return;
    this._player = value;
    this.playerModel = value as unknown as IPlayer;
  }

  get player() {
    return this._player;
  }

  constructor() {
    this.home = true;
    this.playerImageUrl = '';
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.showImage = true;
    }, 600);
  }
}
