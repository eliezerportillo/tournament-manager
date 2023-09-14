import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type GameStatus = 'toConfirm' | 'finished';

@Component({
  selector: 'app-badge-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './badge-status.component.html',
  styleUrls: ['./badge-status.component.scss'],
})
export class BadgeStatusComponent {
  @Input() status: GameStatus = 'toConfirm';

  getStatus(): string {
    return `__app-${this.status}`;
  }
}
