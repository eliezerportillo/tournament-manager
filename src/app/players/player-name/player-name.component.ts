import { Component, Input } from '@angular/core';
import { LineUp } from 'src/app/models/lineup';

@Component({
  selector: 'app-player-name',
  templateUrl: './player-name.component.html',
  styleUrls: ['./player-name.component.scss']
})
export class PlayerNameComponent {
  @Input()
  player?: LineUp;
}
