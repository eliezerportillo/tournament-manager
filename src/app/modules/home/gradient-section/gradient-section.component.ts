import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gradient-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gradient-section.component.html',
  styleUrls: ['./gradient-section.component.scss']
})
export class GradientSectionComponent {
  @Input() text: string = '';
}
