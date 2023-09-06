import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-match-result-icon',
  templateUrl: './match-result-icon.component.html',
  styleUrls: ['./match-result-icon.component.scss']
})
export class MatchResultIconComponent {


  @Input()
  matchResult?: string;

  @Input()
  showText?: boolean;

}
