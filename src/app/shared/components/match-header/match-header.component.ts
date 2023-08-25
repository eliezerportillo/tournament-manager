import { Component, Input } from '@angular/core';
import { IMatch } from 'src/app/models/match';

@Component({
  selector: 'app-match-header',
  templateUrl: './match-header.component.html',
  styleUrls: ['./match-header.component.scss']
})
export class MatchHeaderComponent {

  @Input()
  match?: IMatch;
}
