import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type IconPosition = 'left' | 'right';

@Component({
  selector: 'app-player-avatar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player-avatar.component.html',
  styleUrls: ['./player-avatar.component.scss'],
})
export class PlayerAvatarComponent {
  @Input() iconPosition: IconPosition = 'left';
  @Input() name = '';
  @Input() icon = '';
}
